"use client";

import React from "react";
import Link from "next/link";
import { Cog8ToothIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { devnet, sepolia, mainnet } from "@starknet-react/chains";
import { Faucet } from "~~/components/scaffold-stark/Faucet";
import { FaucetSepolia } from "~~/components/scaffold-stark/FaucetSepolia";
import { BlockExplorerSepolia } from "./scaffold-stark/BlockExplorerSepolia";
import { BlockExplorer } from "./scaffold-stark/BlockExplorer";

export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(
    (state) => state.nativeCurrencyPrice,
  );
  const { targetNetwork } = useTargetNetwork();

  const isLocalNetwork =
    targetNetwork.id === devnet.id && targetNetwork.network === devnet.network;
  const isSepoliaNetwork =
    targetNetwork.id === sepolia.id &&
    targetNetwork.network === sepolia.network;
  const isMainnetNetwork =
    targetNetwork.id === mainnet.id &&
    targetNetwork.network === mainnet.network;

  return (
    <footer className="w-full bg-transparent backdrop-blur-md shadow-lg fixed bottom-0 z-50">
      <div className="container mx-auto py-6 px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Información del Proyecto */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-white">STARKLOTTO</h3>
          <p className="text-sm text-gray-300">
            The most innovative decentralized lottery on the Starknet
            blockchain.
          </p>
        </div>

        {/* Enlaces y Botones */}
        <div className="flex items-center space-x-4">
          {isSepoliaNetwork && (
            <>
              <FaucetSepolia />
              <BlockExplorerSepolia />
            </>
          )}
          {isLocalNetwork && <Faucet />}
          {isMainnetNetwork && <BlockExplorer />}

          <Link
            href="/configure"
            passHref
            className="btn btn-sm font-normal gap-1 cursor-pointer border border-[#32BAC4] shadow-none text-white"
          >
            <Cog8ToothIcon className="h-4 w-4 text-[#32BAC4]" />
            <span>Configure Contracts</span>
          </Link>

          {nativeCurrencyPrice > 0 && (
            <div className="btn btn-sm font-normal gap-1 cursor-auto border border-[#32BAC4] shadow-none text-white">
              <CurrencyDollarIcon className="h-4 w-4 text-[#32BAC4]" />
              <span>{nativeCurrencyPrice}</span>
            </div>
          )}
        </div>

        {/* Enlaces de Redes Sociales */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link
            href="https://github.com/future-minds7"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-white hover:text-yellow-400 transition">
              GitHub
            </span>
          </Link>
          <Link href="https://x.com/futureminds_7" target="_blank" rel="noreferrer">
            <span className="text-white hover:text-yellow-400 transition">
              Twitter
            </span>
          </Link>
          <Link
            href="https://t.me/+wO3PtlRAreo4MDI9"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-white hover:text-yellow-400 transition">
              Telegram
            </span>
          </Link>
        </div>
      </div>

      {/* Derechos de Autor */}
      <div className="w-full text-center py-2 bg-transparent text-gray-400 text-sm">
        © {new Date().getFullYear()} StarkLotto. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
