import { useQuery } from "@tanstack/react-query";
import fetchTokenMarketData from "@/api/fetchTokenMarketData";

interface Props {
  coinGeckoId: string;
  refetchEnabled?: boolean;
}

export const useTokenMarketData = ({
  coinGeckoId,
  refetchEnabled = true,
}: Props) => {
  return useQuery({
    queryKey: ["token-market-data", coinGeckoId],
    queryFn: () => fetchTokenMarketData(coinGeckoId),
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
