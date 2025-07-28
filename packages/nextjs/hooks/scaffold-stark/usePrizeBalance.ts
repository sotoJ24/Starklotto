import { Address } from "@starknet-react/chains";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { useReadContract } from "@starknet-react/core";
import { BlockNumber } from "starknet";
import { Abi } from "abi-wan-kanabi";
import { formatUnits } from "ethers";

type UsePrizeBalanceProps = {
  address?: Address | string;
};

/**
 * Hook to fetch the convertible STARKP balance (prize tokens only)
 * Only STARKP tokens earned as lottery prizes can be converted to STRK
 * Tokens minted for gameplay are NOT convertible
 */
const usePrizeBalance = ({ address }: UsePrizeBalanceProps) => {
  const { data: deployedContract } = useDeployedContractInfo("StarkPlayVault");

  const { data, ...props } = useReadContract({
    functionName: "get_prize_balance",
    address: deployedContract?.address,
    abi: deployedContract?.abi as Abi as any[],
    watch: true,
    enabled: !!address && !!deployedContract?.address,
    args: address ? [address] : [],
    blockIdentifier: "pending" as BlockNumber,
  });

  return {
    value: data as unknown as bigint,
    decimals: 18,
    symbol: "STRKP",
    formatted: data ? formatUnits(data as unknown as bigint) : "0",
    ...props,
  };
};

export default usePrizeBalance;
