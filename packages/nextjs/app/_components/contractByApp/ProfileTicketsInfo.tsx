"use client";

import { Abi } from "abi-wan-kanabi";
import { Address } from "@starknet-react/chains";
import { GetTicketUserForm } from "./GetTicketUserForm";
import { AbiFunction } from "~~/utils/scaffold-stark/contract";

type ProfileTicketsInfoProps = {
  userAddress: Address;
  contractAddress: Address;
  getUserTickets: AbiFunction;
  getTicketInfo: AbiFunction;
  abi: Abi;
};

export const ProfileTicketsInfo = ({
  abi,
  userAddress,
  contractAddress,
  getUserTickets,
  getTicketInfo,
}: ProfileTicketsInfoProps) => {
  return (
    <>
      <GetTicketUserForm
        loteryId={2}
        userAddress={userAddress}
        contractAddress={contractAddress}
        getUserTickets={getUserTickets}
        getTicketInfo={getTicketInfo}
        abi={abi}
      />
    </>
  );
};
