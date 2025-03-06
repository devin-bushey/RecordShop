import { Collection, MongoClient } from "mongodb";
import { Gig } from "../../model/Gig";
import axios from "axios";
import { findBestMatch } from "string-similarity";
import { buildArtist } from "../../model/Artist";
import * as fs from "fs";

require("dotenv").config({ path: "../../../../.env" });

/**
 * USAGE:
 *
 * npx ts-node updateMongoCollection.ts
 *
 */

const ATLAS_URI = process.env.ATLAS_URI || "";
const SP_REFRESH_TOKEN = process.env.SP_REFRESH_TOKEN;
const SP_CLIENT_ID = process.env.SP_CLIENT_ID;
const SP_CLIENT_S = process.env.SP_CLIENT_S;
const DATABASE_COLLECTION_NAME = "victoria_2025";

const getSpotifyAccessToken = async () => {
  const optionsSpotifyAccessToken = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(SP_CLIENT_ID + ":" + SP_CLIENT_S).toString("base64")}`,
    },
    params: {
      grant_type: "refresh_token",
      refresh_token: SP_REFRESH_TOKEN,
      client_id: SP_CLIENT_ID,
    },
  };

  try {
    console.log("Getting Spotify token...");
    const response = await axios(optionsSpotifyAccessToken);
    console.log("Yew!! Successfully retrieved the token");
    return response.data.access_token;
  } catch (error: any) {
    console.error("Failed to get Spotify token:", error.response.data);
    process.exit(-1);
  }
};

async function addSpotifyData(gigsSimple: Gig[]) {
  const token = await getSpotifyAccessToken();

  const populatedGigs: Gig[] = [];

  for (let gig of gigsSimple) {
    let populatedGig = await addSpotifyMainData(gig, token);
    populatedGig = await addSpotifyTopTracks(gig, token);
    gig.date = new Date(gig.date);
    if (populatedGig) populatedGigs.push(gig);
  }

  return populatedGigs;
}

const addSpotifyMainData = async (gig: Gig, token: string): Promise<Gig | undefined> => {
  const artistName = gig.artist.name;
  console.log(`Searching spotify for ${artistName}`);

  return axios({
    url: "https://api.spotify.com/v1/search",
    headers: {
      Authorization: "Bearer " + token,
    },
    params: {
      q: artistName,
      type: "artist",
    },
  })
    .then(async function (res: any) {
      const bestMatch = findMatchingSpotifyArtist(
        res.data.artists.items,
        artistName,
        res.data.artists.items.map((artist: any) => artist.name),
      );

      if (bestMatch) {
        gig.artist = buildArtist({
          id: bestMatch.id,
          name: bestMatch.name,
          link: bestMatch.external_urls.spotify,
          uri: bestMatch.uri,
        });
        console.log(`Found ${bestMatch.name} !`);
        return gig;
      } else {
        console.log(`No good Spotify artist matches for artist "${artistName}"; skipping.`);
        return undefined;
      }
    })

    .catch(function (error: any) {
      console.log(`Error adding Spotify artist data for artist ${artistName}.`, error);
      return undefined;
    });
};

const findMatchingSpotifyArtist = (artists: any, query: string, options: any) => {
  const matches = findBestMatch(
    query.toLowerCase(),
    options.map((option: any) => option.toLowerCase()),
  );

  if (matches.bestMatch.rating >= 0.95) {
    return artists[matches.bestMatchIndex];
  }

  return undefined;
};

const addSpotifyTopTracks = async (gig: Gig, token: string): Promise<Gig | undefined> => {
  const { id, name } = gig.artist;

  if (!id) {
    console.log(`Cannot look up Spotify tracks for unknown artist "${name}"`);
    return undefined;
  }

  return axios({
    url: "https://api.spotify.com/v1/artists/" + id + "/top-tracks?market=CA",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res: any) => {
      gig.artist.albumArtUrl = res.data.tracks[0].album.images[1].url;
      gig.artist.topTracks = res.data.tracks.map((track: any) => track.uri);
      return gig;
    })
    .catch((error: any) => {
      console.log(`Error fetching Spotify tracks for artist "${name}"`, error);
      return undefined;
    });
};

const updateMongoCollection = async () => {
  console.log("Starting to update mongo ...");

  let gigsSimple: Gig[] = [];

  try {
    const rawData = fs.readFileSync("../../../../extractedVicGigs.json", "utf8");
    gigsSimple = JSON.parse(rawData);
    if (gigsSimple.length === 0) {
      console.log("No gigs found in extractedVicGigs.json ");
      process.exit(-1);
    }
  } catch (err) {
    console.log("Error reading file: ", err);
    process.exit(-1);
  }

  const gigs = await addSpotifyData(gigsSimple);
  if (!gigs || gigs.length === 0) {
    console.log("No gigs found");
    process.exit(-2);
  }

  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(ATLAS_URI);
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const db = client.db("RecordShop");
    const collection: Collection<Gig> = db.collection(DATABASE_COLLECTION_NAME);

    let numGigsAdded = 0;
    for (const gig of gigs) {
      // Checks if there is an existing gig with the same ID and date
      // Might be duplicate artists if they play back to back nights, hmmm.
      // But we dont delete them from the database, so I would want to add them if theres a long
      // period of time between shows.
      const existingGig = await collection.findOne({
        "artist.id": gig.artist.id,
      });

      if (!existingGig) {
        await collection.insertOne(gig);
        console.log(`Added concert for ${gig.artist.name} on ${gig.date} to the database`);
        numGigsAdded++;
      } else {
        console.log(`Concert for ${gig.artist.name} on ${gig.date} already exists in the database`);
      }
    }
    console.log(`${numGigsAdded} gigs were added`);
    await client.close();
  } catch (error) {
    console.error("Failed to update MongoDB:", error);
  }
};

updateMongoCollection();
