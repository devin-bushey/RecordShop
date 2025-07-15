import { SpotifyPlaylistDataType } from "../types/SpotifyTypes";
import { PLAYLIST_IMG_RS } from "../assets/recordshop_img";
import { sortByPopularity } from "./sortByPopularity";
import { sortByDateAndOrder } from "./sortByDateAndOrder";
import { filterRecent } from "./filterRecent";
import { post, put } from "../http/request";
import { HttpRequestError } from "../http/HttpRequestError";
import { Cities } from "../enums/Cities";
import { Festivals } from "../enums/Festivals";
import { Gig } from "../types/Gig";
import { IMAGE_PACHENA_BAY } from "../assets/pachenaBayImg";

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks = 1,
  gigs,
  sortBy = "date",
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  gigs: Gig[];
  sortBy?: "popularity" | "date";
}) => {
  const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({
    token,
    city,
    user_id,
  });

  const playlist_id = playlist_data.new_playlist_id || "";

  let sortedGigs = sortBy === "popularity" ? sortByPopularity(gigs) : sortByDateAndOrder(gigs);
  let coverArt = PLAYLIST_IMG_RS;

  if (
    city === Cities.Victoria_2025 ||
    city === Cities.Vancouver ||
    city === Cities.Calgary
  ) {
    sortedGigs = filterRecent(sortedGigs);
  }

  if (city === Festivals.PachenaBay) {
    coverArt = IMAGE_PACHENA_BAY;
  }

  if (city === Festivals.PhilipsBackyard2024 || city === Festivals.Rifflandia2024) {
    sortedGigs = sortByPopularity(gigs);
  }

  try {
    await AddCoverArt({ token, playlist_id, coverArt });
  } catch (err) {
    console.log("Error adding cover art");
  }

  let tracks = "";

  for (const gig of sortedGigs) {
    try {
      for (let i = 0; i < numTopTracks; i++) {
        if (gig.artist.topTracks && gig.artist.topTracks[i]) {
          tracks += gig.artist.topTracks[i];
          tracks += ",";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  tracks = tracks.substring(0, tracks.length - 1); // remove last comma

  const array = tracks.split(",");
  const MAX_CHUNK_LENGTH = 75;
  const trackArrays = [];

  while (array.length > 0) {
    const chunk = array.splice(0, MAX_CHUNK_LENGTH);
    trackArrays.push(chunk);
  }

  for (const trackArray of trackArrays) {
    const tracks = trackArray.join(",");
    if (playlist_data.new_playlist_id && playlist_data.external_urls?.spotify) {
      await AddTracksToPlaylist(token, playlist_data.new_playlist_id, tracks);
    }
  }
  return playlist_data.external_urls?.spotify;
};

export const CreateBlankPlaylist = async ({
  token,
  city,
  user_id,
}: {
  token: string;
  city: string;
  user_id: string;
}): Promise<SpotifyPlaylistDataType> => {
  let playlist_name = "record shop " + city;

  if (city === Cities.Victoria_2025) {
    playlist_name = "record shop victoria";
  }

  if (city === Cities.Vancouver) {
    playlist_name = "record shop vancouver";
  }

  if (city === Cities.Calgary) {
    playlist_name = "record shop calgary";
  }

  if (city === Festivals.LaketownShakedown_2024) {
    playlist_name = "record shop laketown shakedown";
  }

  if (city === Festivals.PachenaBay) {
    playlist_name = "record shop pachena bay";
  }

  if (city === Festivals.PhilipsBackyard2024) {
    playlist_name = "record shop phillips backyard 2024";
  }

  if (city === Festivals.Rifflandia2024) {
    playlist_name = "record shop rifflandia 2024";
  }

  let description = `a mixtape created by recordshop.cool`;

  return post({
    url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      name: playlist_name,
      description: description,
      public: true,
    },
  })
    .then((response) => {
      const data = response.data;

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: data.id,
        external_urls: {
          spotify: data.external_urls.spotify,
        },
      };

      return returnVal;
    })
    .catch(function (error) {
      console.log("Error: CreateBlankPlaylist");
      console.log(error);

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: "",
        external_urls: {
          spotify: "",
        },
      };

      return returnVal;
    });
};

export const AddCoverArt = async ({
  token,
  playlist_id,
  coverArt,
}: {
  token: string;
  playlist_id: string;
  coverArt: string;
}) => {
  return put({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/images",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "image/jpeg",
    },
    data: coverArt,
  }).catch(function (error) {
    const err = error as HttpRequestError;
    console.log("Error: unsuccessfully added cover art to playlist", err);
  });
};

export const AddTracksToPlaylist = async (token: string, playlist_id: string, tracks: string) => {
  return post({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + tracks,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch(function (error) {
    const err = error as HttpRequestError;
    console.log("Error: unsuccessfully added tracks to playlist");
    console.log(err.message);
    return null;
  });
};
