import { LocationType } from "../types/RecordShopTypes";
import { Cities, Festivals } from "./enums";

export const WEBSITE_VICTORIA = "https://victoriamusicscene.com/concerts/";
export const WEBSITE_LAKETOWN = "https://www.laketownshakedown.com/";
export const WEBSITE_RIFFLANDIA = "https://rifflandia.com/tickets/";

// This order of locations in this list corresponds to the order in the dropdown in the UI
export const LOCATIONS: LocationType[] = [
  {
    name: "Victoria, BC",
    value: Cities.Victoria_2025,
  },
  {
    name: "Vancouver, BC",
    value: Cities.Vancouver,
  },
  {
    name: "Toronto, ON",
    value: Cities.Toronto,
  },
  {
    name: "San Francisco, CA",
    value: Cities.SanFrancisco,
  },
  {
    name: "Pleasanton, CA",
    value: Cities.Pleasanton,
  },
  // {
  //   name: "Laketown Shakedown",
  //   value: Festivals.LaketownShakedown_2024,
  // },
  // {
  //   name: "Pachena Bay",
  //   value: Festivals.PachenaBay,
  // },
];
