"use client";

// @refresh reset
import { useReducer } from "react";
import dynamic from "next/dynamic";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import {
  ContractCodeStatus,
  ContractName,
} from "~~/utils/scaffold-stark/contract";

const ContractWriteMethods = dynamic(
  () =>
    import("./ContractWriteMethods").then((mod) => mod.ContractWriteMethods),
  {
    loading: () => <p>Loading Write Methods...</p>,
  },
);

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractPlayUI = ({ contractName }: ContractUIProps) => {
  const [_, triggerRefreshDisplayVariables] = useReducer(
    (value) => !value,
    false,
  );
  const {
    raw: deployedContractData,
    isLoading: deployedContractLoading,
    status,
  } = useDeployedContractInfo(contractName);

  if (status === ContractCodeStatus.NOT_FOUND) {
    return <p className="text-3xl mt-14">{`Please connect your wallet!`}</p>;
  }

  return (
    <>
      <ContractWriteMethods
        deployedContractData={deployedContractData}
        onChange={triggerRefreshDisplayVariables}
      />
      {deployedContractLoading && (
        <div className="absolute inset-0 rounded-[5px] bg-white/20 z-10">
          <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full absolute top-4 right-4" />
        </div>
      )}
    </>
  );
};
