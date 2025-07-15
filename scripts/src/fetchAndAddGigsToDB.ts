require("dotenv").config({ path: "../.env" });

import axios from "axios";
import { Collection, MongoClient } from "mongodb";
import { Gig } from "./model/Gig";

// USAGE:
// npx ts-node ./src/fetchAndAddGigsToDB.ts <city>

const ATLAS_URI = process.env.ATLAS_URI || "";
const API_KEY_JAMBASE = process.env.API_KEY_JAMBASE;
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

const getJambaseGeoId = async () => {
  let city = CITY;

  if (CITY === "victoria") {
    return "jambase:382342";
  } else if (CITY === "vancouver") {
    return "jambase:379457";
  } else if (CITY === "calgary") {
    return "jambase:379128";
  }

  const options = {
    method: "GET",
    url: "https://www.jambase.com/jb-api/v1/geographies/cities",
    params: { geoCityName: `city`, apikey: API_KEY_JAMBASE },
    headers: { Accept: "application/json" },
  };

  try {
    const { data } = await axios(options);
    console.log(data);
    const cityId = data.cities[0].identifier;
    console.log(cityId);
    return cityId;
  } catch (error) {
    console.error(error);
  }
};

const getEventsFromJambase = async () => {
  const geoCityId = await getJambaseGeoId();

  const optionsJamBase = {
    method: "GET",
    url: "https://www.jambase.com/jb-api/v1/events",
    params: {
      eventType: "concerts",
      geoCityId: geoCityId,
      geoRadiusAmount: "50",
      // geoCityId: "jambase:382342", // Victoria
      // geoCityId: "jambase:379457", // Vancouver
      // geoCityId: "jambase:380343", // Toronto
      // geoCityId: "jambase:4226292", // Pleasanton
      apikey: API_KEY_JAMBASE,
      expandExternalIdentifiers: true,
      perPage: 100,
    },
    headers: { Accept: "application/json" },
  };

  try {
    console.log("Fetching events from JamBase...");
    const response = await axios(optionsJamBase);
    console.log(`Ayooo!! Successfully fetched ${response.data.events.length} events`);
    return response.data.events;
  } catch (error) {
    console.error("Failed to get events:", error);
    process.exit(-2);
  }
};

const buildGigListWithSpotifyData = async (events: any, bearerToken: string): Promise<Gig[]> => {
  console.log("Building gig list with spotify data ...");
  const concertData: Gig[] = [];
  const existingArtists = new Set();
  for (const event of events) {
    for (const performer of event.performer) {
      const spotifyId = performer["x-externalIdentifiers"].find(
        (externalIdentifier: any) => externalIdentifier.source === "spotify",
      )?.identifier[0];
      if (spotifyId && !existingArtists.has(spotifyId)) {
        existingArtists.add(spotifyId);
        const optionsSpotify = {
          method: "GET",
          url: `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks`,
          headers: { Accept: "application/json", Authorization: `Bearer ${bearerToken}` },
        };
        const spotifyResponse = await axios(optionsSpotify);
        const topTracks = spotifyResponse.data.tracks;
        const concertObject = {
          artist: {
            id: spotifyId,
            name: spotifyResponse.data.tracks[0]?.album.artists[0].name || "",
            topTracks: topTracks.map((track: any) => track.uri),
            uri: `spotify:artist:${spotifyId}`,
            albumArtUrl: spotifyResponse.data.tracks[0]?.album.images[1].url || "",
            link: `https://open.spotify.com/artist/${spotifyId}`,
          },
          date: new Date(event.endDate),
          venue: event.location.name,
        };
        concertData.push(concertObject);
      }
    }
  }
  console.log(`Retrieved ${concertData.length} concerts`);
  return concertData;
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
    const spotifyAccessToken = await getSpotifyAccessToken();
    const jamBaseEvents = await getEventsFromJambase();
    const gigs = await buildGigListWithSpotifyData(jamBaseEvents, spotifyAccessToken);
    updateMongoDb(gigs);
  } catch (error) {
    console.error("Whoops, something went wrong :(", error);
  }
};

getConcertData();
