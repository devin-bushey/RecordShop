import axios from "axios";
import * as cheerio from "cheerio";
import { buildArtist } from "../../model/Artist";
import { Gig, buildGig } from "../../model/Gig";
import { cleanArtistNames } from "../../utils/openai";
require("dotenv").config({ path: "../.env" });

/**
 * USAGE:
 *
 * npx ts-node extractSongkick.ts <DATABASE_URL>
 *
 * For local DBs, use the DB URL is 'mongodb://root:example@localhost:27017/'
 */

const URL_VICTORIA_PAGE_1 = "https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar";

export const extractSongkick = async ({ url = URL_VICTORIA_PAGE_1 }: { url?: string }) => {
  let gigs: Gig[] = [];
  let rawGigs: { artistName: string; venue: string; date: Date | undefined }[] = [];

  await axios
    .get(url)
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      for (const element of $(".event-listings-element").toArray()) {
        let artistName = $(element).find("p.artists").text().trim();
        let artistNameReduced = "";
        const escape_chars = ["\n"];
        for (let i = 0; i < escape_chars.length; i++) {
          if (artistName.includes(escape_chars[i])) {
            artistNameReduced = artistName.substring(0, artistName.indexOf(escape_chars[i])).trim();
            break;
          } else {
            artistNameReduced = artistName;
          }
        }

        var dateString = $(element).find("time").attr("datetime");
        var dateReduced = dateString?.substring(0, 10);
        var date = dateReduced ? new Date(dateReduced) : undefined;

        var venue = $(element).find(".venue-link").text().trim();

        rawGigs.push({
          artistName: artistNameReduced,
          venue,
          date
        });
      }
      return rawGigs;
    })
    .catch((error: any) => {
      console.log(error);
      console.log("Error extracting songkick");
    });

  // Clean all artist names in a single OpenAI request
  const cleanedArtists = await cleanArtistNames(rawGigs.map(gig => gig.artistName));

  // Create gigs with cleaned artist names
  for (let i = 0; i < rawGigs.length; i++) {
    const rawGig = rawGigs[i];
    const artistName = rawGig.artistName;
    const artistsForGig = cleanedArtists[artistName] || [];

    // Create a gig for each real artist
    for (const cleanedArtist of artistsForGig) {
      if (cleanedArtist.isRealArtist) {
        gigs.push(
          buildGig({
            artist: buildArtist({ name: cleanedArtist.name }),
            venue: rawGig.venue,
            date: rawGig.date,
            popularity: gigs.length,
          }),
        );
      }
    }
  }

  console.log(JSON.stringify(gigs, null, 2));
  return JSON.stringify(gigs, null, 2);
};

extractSongkick({});
