"use client";

import { useState, useEffect } from "react";
import { Abi } from "abi-wan-kanabi";
import { Address } from "@starknet-react/chains";
import {
  getArgsAsStringInputFromForm,
  decodeContractResponse,
} from "~~/app/_components/contractByApp";
import { AbiFunction } from "~~/utils/scaffold-stark/contract";
import { BlockNumber } from "starknet";
import { useContract, useReadContract } from "@starknet-react/core";
import TicketInfoDisplay from "./TicketInfoDisplay";
import { TicketInfo } from "~~/interfaces/global";

type GetTicketInfoFormProps = {
  selectedTicketId: string;
  loteryId: number;
  userAddress: Address;
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: Abi;
};

export const GetTicketInfoForm = ({
  selectedTicketId,
  loteryId,
  userAddress,
  contractAddress,
  abiFunction,
  abi,
}: GetTicketInfoFormProps) => {
  const [inputValue, setInputValue] = useState<any | undefined>(undefined);

  const { contract: contractInstance } = useContract({
    abi,
    address: contractAddress,
  });

  const { isFetching, data, refetch, error } = useReadContract({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: [...abi],
    args: inputValue || [],
    enabled: !!inputValue && !!contractInstance,
    blockIdentifier: "pending" as BlockNumber,
  });

  useEffect(() => {
    if (error) {
      console.error(error?.message);
      console.error(error.stack);
    }
  }, [error]);

  useEffect(() => {
    if (selectedTicketId !== "") {
      const handleRead = () => {
        const newInputValue = getArgsAsStringInputFromForm({
          "GetTicketInfo_drawId_core::integer::u64": loteryId,
          "GetTicketInfo_ticketId_core::felt252": selectedTicketId,
          "GetTicketInfo_player_core::starknet::contract_address::ContractAddress":
            userAddress,
        });
        setInputValue(newInputValue);
        refetch();
      };
      handleRead();
    }
  }, [selectedTicketId, userAddress, loteryId, refetch]);

  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="flex-grow w-4/5">
          {isFetching ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            data !== null &&
            data !== undefined &&
            abi &&
            abiFunction && (
              <div className="bg-input text-sm px-4 py-1.5 break-words">
                {
                  <TicketInfoDisplay
                    ticket={
                      JSON.parse(
                        decodeContractResponse({
                          resp: data,
                          abi,
                          functionOutputs: abiFunction?.outputs,
                          asText: true,
                        }),
                      ) as TicketInfo
                    }
                  />
                }
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
