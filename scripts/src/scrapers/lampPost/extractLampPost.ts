import axios from "axios";
import * as cheerio from "cheerio";
import { buildArtist } from "../../model/Artist";
import { Gig, buildGig } from "../../model/Gig";
import { cleanArtistNames } from "../../utils/openai";
require("dotenv").config({ path: "../.env" });


const URL_LAMP_POST = "https://www.lamppostvictoria.com/events/live-music-folder/live-music";

export const extractLampPost = async ({ url = URL_LAMP_POST }: { url?: string }) => {
  let gigs: Gig[] = [];
  let rawGigs: { artistName: string; venue: string; date: Date | undefined }[] = [];

  await axios
    .get(url)
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const eventElements = $(".collection-item-3").toArray();

      for (const element of eventElements) {
        // Extract event name - using the element with fs-cmsfilter-field="Event-Name"
        let artistName = $(element).find("[fs-cmsfilter-field='Event-Name']").text().trim();
        
        // Extract venue - using the element with fs-cmsfilter-field="Event-Venue"
        var venue = $(element).find("[fs-cmsfilter-field='Event-Venue']").text().trim();
        
        // Extract date - combining day and date
        var day = $(element).find(".text-block-76").text().trim();
        var dateString = $(element).find(".text-block-230").text().trim();
        
        // Parse date properly - format is "Mar 15, 2025"
        var date: Date | undefined;
        try {
          date = new Date(dateString);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            // console.log(`Invalid date for event "${artistName}": ${dateString}`);
            date = undefined;
          }
        } catch (error) {
          // console.log(`Error parsing date for event "${artistName}": ${dateString}`);
          date = undefined;
        }

        // Only add if we have an artist name and venue
        if (artistName && venue) {
          rawGigs.push({
            artistName,
            venue,
            date
          });
        } 
      }
      
      return rawGigs;
    })
    .catch((error: any) => {
      console.log(`Error extracting from LampPost: ${error.message}`);
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

extractLampPost({});
