import { Abi } from "abi-wan-kanabi";

import {
  Contract,
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
import { WriteOnlyFunctionForm } from "./WriteOnlyFunctionForm";
import { useContractFnStore } from "~~/services/store/contractFn";

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

  const filteredFunctionsNames = useContractFnStore((state) => state.filteredFunctionsNames);

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
      {filteredFunctions.map(({ fn }, idx) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}}`}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          //   inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
