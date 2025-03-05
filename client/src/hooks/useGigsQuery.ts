import { QueryFunction, useQuery } from "react-query";
import { Cities, Festivals } from "../constants/enums";
import { getGigsFromRecordShop } from "../apiManager/getGigsFromRecordShop";
import { Gig } from "../types/Gig";

export const useGigsQuery = (queryKey: Festivals | Cities) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const getGigQueryFn: QueryFunction<Gig[]> = async () => {
    try {
      return await getGigsFromRecordShop(queryKey);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred while fetching gigs");
    }
  };

  return useQuery({
    queryKey: [queryKey],
    queryFn: getGigQueryFn,
    ...queryOptions,
  });
};
