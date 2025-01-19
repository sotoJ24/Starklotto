"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  getTopErrorMessage,
} from "~~/app/_components/contractByApp";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import {
  useSendTransaction,
  useNetwork,
  useContract,
} from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import { InvokeTransactionReceiptResponse } from "starknet";
import { TxReceipt } from "./TxReceipt";
import { useTransactor } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { usePlayStore } from "~~/services/store/play";
import { Abi } from "abi-wan-kanabi";

type BuyTicketFormProps = {
  abi: Abi;
  contractAddress: Address;
  onChange: () => void;
};

export const BuyTicketForm = ({
  abi,
  contractAddress,
  onChange,
}: BuyTicketFormProps) => {
  const selectedLotteryId = usePlayStore((state) => state.loteryId);
  const selectedNumbers = usePlayStore((state) => state.loteryNumbersSelected);
  const { status: walletStatus } = useAccount();
  const { chain } = useNetwork();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = useMemo(
    () => !chain || chain?.network !== targetNetwork.network || walletStatus === "disconnected",
    [chain, targetNetwork.network, walletStatus],
  );

  const { contract: contractInstance } = useContract({
    abi,
    address: contractAddress,
  });

  const { data: result, isPending: isLoading, sendAsync, error } = useSendTransaction({});

  // side effect for error logging
  useEffect(() => {
    if (error) {
      console.error(error?.message);
      console.error(error.stack);
    }
  }, [error]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendAsync) {
      try {
        const makeBuyTicketWithParams = () =>
          sendAsync(
            !!contractInstance
              ? [
                  contractInstance.populate(
                    "BuyTicket", // Nombre de la función en el contrato
                    [selectedLotteryId, selectedNumbers], // Usar datos del store
                  ),
                ]
              : [],
          );
        await writeTxn(makeBuyTicketWithParams);
        onChange();
      } catch (e: any) {
        console.error("Error al comprar el ticket:", e.message);
      }
    }
  };

  const errorMsg = writeDisabled ? "Wallet not connected or on wrong network" : "";

  return (
    <form onSubmit={onSubmit} className="py-5 space-y-3">
      <p className="font-medium my-0">Comprar Ticket</p>
      <div>
        <p>ID de Lotería: {selectedLotteryId}</p>
        <p>Números seleccionados: {selectedNumbers.join(', ')}</p>
      </div>
      <div>
        <button
          className="btn bg-gradient-dark btn-sm shadow-none border-none text-white"
          disabled={writeDisabled || isLoading}
          type="submit"
        >
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          Comprar Ticket 💸
        </button>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      </div>
      {result && <TxReceipt txResult={result} />}
    </form>
  );
}; 