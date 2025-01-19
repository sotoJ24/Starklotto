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
        <div key={idx}>
          <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          //   inheritedFrom={inheritedFrom}
        />
        <BuyTicketForm
          abi={deployedContractData.abi as Abi}
          onChange={onChange}
          contractAddress={deployedContractData.address}
        />
        </div>
      ))}
    </>
  );
};
