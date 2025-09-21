import { useQuery } from "@tanstack/react-query";
import fetchTokenMarketData from "@/api/fetchTokenMarketData";

interface Props {
  coinGeckoIds: string[];
  refetchEnabled?: boolean;
}

export const useTokenMarketData = ({
  coinGeckoIds,
  refetchEnabled = true,
}: Props) => {
  return useQuery({
    queryKey: ["token-market-data", coinGeckoIds],
    queryFn: () => fetchTokenMarketData(coinGeckoIds),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: refetchEnabled,
  });
};

export default useTokenMarketData;
