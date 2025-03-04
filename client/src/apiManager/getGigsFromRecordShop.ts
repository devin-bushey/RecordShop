import axios from "axios";
import { filterRecent, sortByPopularity, sortDataByDateAndOrder } from "../utils/sorter";
import { Cities, Festivals } from "../constants/enums";
import { Gig } from "../types/Gig";
import { ApiResponse } from "../types/ApiResponse";

export const getGigsFromRecordShop = async (collectionName: string): Promise<Gig[]> => {
  try {
    const response = await axios.get<ApiResponse<Gig[]>>(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: collectionName,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch gigs");
    }

    if (!response.data.data) {
      throw new Error("No data received from server");
    }

    const gigs = response.data.data;

    if (
      collectionName === Cities.Victoria_2024 ||
      collectionName === Cities.Vancouver ||
      collectionName === Cities.Toronto ||
      collectionName === Cities.Pleasanton ||
      collectionName === Cities.SanFrancisco
    ) {
      const sorted = sortDataByDateAndOrder(gigs);
      return filterRecent(sorted);
    }

    if (
      collectionName === Festivals.PachenaBay ||
      collectionName === Festivals.PhillipsBackyard2024 ||
      collectionName === Festivals.LaketownShakedown_2024 ||
      collectionName === Festivals.Rifflandia2024
    ) {
      return sortByPopularity(gigs);
    }

    return sortDataByDateAndOrder(gigs);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("No gigs found for this location");
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || "Invalid request");
      }
      throw new Error(error.response?.data.error || "Failed to fetch gigs");
    }
    throw error;
  }
};
