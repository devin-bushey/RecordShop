import axios from "axios";
import { filterRecent, sortByPopularity, sortDataByDateAndOrder } from "../utils/sorter";
import { Cities, Festivals } from "../constants/enums";
import { Gig } from "../types/Gig";
import { ApiResponse } from "../types/ApiResponse";

export const GetTickets = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  // eslint-disable-next-line
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: origin,
      },
    })
    .then(async (response) => {
      if (
        origin === Cities.Victoria_2024 ||
        origin === Cities.Vancouver ||
        origin === Cities.Toronto ||
        origin === Cities.Pleasanton ||
        origin === Cities.SanFrancisco
      ) {
        const sorted = sortDataByDateAndOrder(response.data);
        return filterRecent(sorted);
      }
      if (origin === Festivals.LaketownShakedown_2024) {
        const ordered = sortByPopularity(response.data);
        return ordered;
      }
      return sortDataByDateAndOrder(response.data);
    });
};

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks,
  overrideGigs,
  sortBy = "date",
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  overrideGigs?: Gig[];
  sortBy?: "popularity" | "date";
}) => {
  try {
    console.log("Making request to create playlist...");
    const response = await axios.post<ApiResponse<string>>(import.meta.env.VITE_SITE_URL_DB + "create/", {
      token,
      user_id,
      city,
      numTopTracks,
      sortBy,
      overrideGigs,
    });

    console.log("Raw response:", response);
    console.log("Response data type:", typeof response.data);
    console.log("Response data:", response.data);

    // Check if response.data is a string (direct URL)
    if (typeof response.data === 'string') {
      console.log("Direct URL response:", response.data);
      return response.data;
    }

    // Check if response.data has the expected ApiResponse structure
    if (response.data && typeof response.data === 'object') {
      if (!response.data.success || !response.data.data) {
        console.log("Error in response:", response.data);
        throw new Error(response.data.error || "Failed to create playlist");
      }
      console.log("URL from response data:", response.data.data);
      return response.data.data;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error in CreateNewPlaylist:", error);
    throw error;
  }
};
