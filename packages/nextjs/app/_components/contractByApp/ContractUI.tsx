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
export const ContractUI = ({
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
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}
    >
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            {/* <div className="rounded-[5px] border border-[#8A45FC] flex flex-col relative bg-component">
              <div className="p-5 divide-y divide-secondary">
                {activeTab === "read" && (
                  <ContractReadMethods
                    deployedContractData={deployedContractData}
                  />
                )}
                {activeTab === "write" && (
                  <ContractWriteMethods
                    deployedContractData={deployedContractData}
                    onChange={triggerRefreshDisplayVariables}
                  />
                )}
              </div>
              {deployedContractLoading && (
                <div className="absolute inset-0 rounded-[5px] bg-white/20 z-10">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full absolute top-4 right-4" />
                </div>
              )}
            </div> */}
            {/*             <ContractReadMethods
              deployedContractData={deployedContractData}
            /> */}
            <ContractWriteMethods
              deployedContractData={deployedContractData}
              onChange={triggerRefreshDisplayVariables}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
