require("dotenv").config({ path: "../.env" });

import axios from "axios";
import { getSpotifyAccessToken } from "../services/spotifyAuth";

// USAGE:
// npx ts-node ./src/playlists/updatePlaylist.ts

// Updates the Victoria spotify playlist on the RecordShop account

const SP_RECORDSHOP_USER_ID = process.env.SP_RECORDSHOP_USER_ID || "";
const BACKEND_URI = process.env.VITE_SITE_URL_DB || "";

const updatePlaylist = async (spotifyAccessToken: string) => {
  const options = {
    method: "PUT",
    url: `${BACKEND_URI}playlist/update`,
    data: {
      token: spotifyAccessToken,
      userId: SP_RECORDSHOP_USER_ID,
      playlistName: "Record Shop Victoria",
      collectionName: "victoria_2025",
    },
    headers: { Accept: "application/json" },
  };

  await axios(options);
};

const run = async () => {
  try {
    const spotifyAccessToken = await getSpotifyAccessToken();
    updatePlaylist(spotifyAccessToken);
  } catch (error) {
    console.error("Whoops, something went wrong :(", error);
  }
};

run();
