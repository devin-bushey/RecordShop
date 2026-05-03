require("dotenv").config({ path: "../.env" });

import axios from "axios";
import { Collection, MongoClient } from "mongodb";
import { Gig } from "./model/Gig";

// USAGE:
// npx ts-node ./src/fetchAndAddGigsToDB.ts <city>

const ATLAS_URI = process.env.ATLAS_URI || "";
const SP_REFRESH_TOKEN = process.env.SP_REFRESH_TOKEN;
const SP_CLIENT_ID = process.env.SP_CLIENT_ID;
const SP_CLIENT_S = process.env.SP_CLIENT_S;

const CITY = process.argv[2];

const COLLECTION_NAME = `${CITY}_2025`;

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
    console.error("Failed to get Spotify token");
    process.exit(-1);
  }
};

const updateMongoDb = async (gigs: Gig[]) => {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(ATLAS_URI);
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const db = client.db("RecordShop");
    const collection: Collection<Gig> = db.collection(COLLECTION_NAME);

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

const getConcertData = async () => {
  try {
    console.log("JamBase integration has been removed. Please use alternative data sources.");
    // TODO: Implement alternative data source integration here
  } catch (error) {
    console.error("Whoops, something went wrong :(", error);
  }
};

getConcertData();
