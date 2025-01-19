"use client";

// @refresh reset
import { useReducer, useState } from "react";
import dynamic from "next/dynamic";
import { ContractReadMethods } from "./ContractReadMethods";
import { Address, Balance } from "~~/components/scaffold-stark";
import {
  useDeployedContractInfo,
  useNetworkColor,
} from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import {
  ContractCodeStatus,
  ContractName,
} from "~~/utils/scaffold-stark/contract";
import { ContractVariables } from "./ContractVariables";
import { ClassHash } from "~~/components/scaffold-stark/ClassHash";

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
export const ContractPlayUI = ({
  contractName,
  className = "",
}: ContractUIProps) => {
  const [activeTab, setActiveTab] = useState("read");
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(
    (value) => !value,
    false,
  );
  const { targetNetwork } = useTargetNetwork();
  const {
    raw: deployedContractData,
    isLoading: deployedContractLoading,
    status,
  } = useDeployedContractInfo(contractName);

  const tabs = [
    { id: "read", label: "Read" },
    { id: "write", label: "Write" },
  ];

  if (status === ContractCodeStatus.NOT_FOUND) {
    return <p className="text-3xl mt-14">{`Please connect your wallet!`}</p>;
  }

  return (
    <ContractWriteMethods
      deployedContractData={deployedContractData}
      onChange={triggerRefreshDisplayVariables}
    />
  );
};
