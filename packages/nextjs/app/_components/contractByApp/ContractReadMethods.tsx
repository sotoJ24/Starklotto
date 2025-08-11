import { Abi } from "abi-wan-kanabi";
import {
  AbiFunction,
  Contract,
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
import { ReadOnlyFunctionForm } from "./ReadOnlyFunctionForm";
import { useContractFnStore } from "~~/services/store/contractFn";
import { ProfileTicketsInfo } from "./ProfileTicketsInfo";
import { Page } from "~~/interfaces/global";
import { useAccount } from "~~/hooks/useAccount";
import { useMemo } from "react";
import { getChecksumAddress } from "starknet";

export const ContractReadMethods = ({
  deployedContractData,
}: {
  deployedContractData: Contract<ContractName>;
}) => {
  const currentPage = useContractFnStore((state) => state.currentPage);
  const { address: accountAddress } = useAccount();
  const checkSumAddress = useMemo(() => {
    if (!accountAddress) return undefined;

    if (accountAddress.toLowerCase() === "0x") {
      return "0x0";
    }

    return getChecksumAddress(accountAddress);
  }, [accountAddress]);
  const filteredFunctionsNames = useContractFnStore(
    (state) => state.filteredFunctionsNames,
  );

  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = getFunctionsByStateMutability(
    (deployedContractData.abi || []) as Abi,
    "view",
  )
    .filter((fn) => {
      const isQueryableWithParams = fn.inputs.length > 0;
      return isQueryableWithParams;
    })
    .map((fn) => {
      return {
        fn,
      };
    });
  if (!functionsToDisplay.length) {
    return <>No read methods</>;
  }

  const filteredFunctions = functionsToDisplay.filter((fn) =>
    filteredFunctionsNames.read.includes(fn.fn.name.toLowerCase()),
  );

  return (
    <>
      {currentPage === Page.Profile ? (
        <ProfileTicketsInfo
          userAddress={checkSumAddress as `0x${string}`}
          contractAddress={deployedContractData.address}
          abi={deployedContractData.abi as Abi}
          getUserTickets={
            filteredFunctions.find(
              (fn) => fn.fn.name.toLowerCase() === "getusertickets",
            )?.fn as AbiFunction
          }
          getTicketInfo={
            filteredFunctions.find(
              (fn) => fn.fn.name.toLowerCase() === "getticketinfo",
            )?.fn as AbiFunction
          }
        />
      ) : (
        filteredFunctions.map(({ fn }) => (
          <ReadOnlyFunctionForm
            abi={deployedContractData.abi as Abi}
            contractAddress={deployedContractData.address}
            abiFunction={fn}
            key={fn.name}
          />
        ))
      )}
    </>
  );
};
