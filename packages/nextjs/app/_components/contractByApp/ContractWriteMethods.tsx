import { Abi } from "abi-wan-kanabi";

import {
  Contract,
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
/* import { WriteOnlyFunctionForm } from "./WriteOnlyFunctionForm"; */
import { useContractFnStore } from "~~/services/store/contractFn";
import { BuyTicketForm } from "./BuyTicketForm";
import { WriteOnlyFunctionForm } from "./WriteOnlyFunctionForm";
import { Page } from "~~/interfaces/global";

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const currentPage = useContractFnStore((state) => state.currentPage);
  const filteredFunctionsNames = useContractFnStore(
    (state) => state.filteredFunctionsNames,
  );

  const functionsToDisplay = getFunctionsByStateMutability(
    (deployedContractData.abi || []) as Abi,
    "external",
  ).map((fn) => {
    return {
      fn,
    };
  });

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  const filteredFunctions = functionsToDisplay.filter((fn) =>
    filteredFunctionsNames.write.includes(fn.fn.name.toLowerCase()),
  );

  return (
    <>
      {filteredFunctions.map(({ fn }, idx) =>
        currentPage === Page.Play ? (
          <BuyTicketForm
            key={idx}
            abi={deployedContractData.abi as Abi}
            onChange={onChange}
            contractAddress={deployedContractData.address}
          />
        ) : (
          <WriteOnlyFunctionForm
            key={idx}
            abiFunction={fn}
            abi={deployedContractData.abi as Abi}
            onChange={onChange}
            contractAddress={deployedContractData.address}
          />
        ),
      )}
    </>
  );
};
