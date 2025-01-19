import { Abi } from "abi-wan-kanabi";
import {
  Contract,
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
import { ReadOnlyFunctionForm } from "./ReadOnlyFunctionForm";
import { useContractFnStore } from "~~/services/store/contractFn";

export const ContractReadMethods = ({
  deployedContractData,
}: {
  deployedContractData: Contract<ContractName>;
}) => {
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
      {filteredFunctions.map(({ fn }) => (
        <ReadOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          contractAddress={deployedContractData.address}
          abiFunction={fn}
          key={fn.name}
        />
      ))}
    </>
  );
};
