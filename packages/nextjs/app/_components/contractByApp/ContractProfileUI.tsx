"use client";

// @refresh reset
import { ContractReadMethods } from "./ContractReadMethods";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import {
  ContractCodeStatus,
  ContractName,
} from "~~/utils/scaffold-stark/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractProfileUI = ({ contractName }: ContractUIProps) => {
  const { targetNetwork } = useTargetNetwork();
  const {
    raw: deployedContractData,
    isLoading: deployedContractLoading,
    status,
  } = useDeployedContractInfo(contractName);

  if (status === ContractCodeStatus.NOT_FOUND) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <>
      <ContractReadMethods deployedContractData={deployedContractData} />
      {deployedContractLoading && (
        <div className="absolute inset-0 rounded-[5px] bg-white/20 z-10">
          <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full absolute top-4 right-4" />
        </div>
      )}
    </>
  );
};
