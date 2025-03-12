import OpenAI from "openai";
import 'dotenv/config'
import * as fs from "fs";

export const getConcertsInVictoria = async () => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const websites = [
        "https://thecapitalballroom.com/all-events/",
        "https://do250.com/events/music/today",
        "https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar",
        "https://www.eventbrite.ca/d/canada--victoria/music--performances/",
        "https://www.lamppostvictoria.com/events/live-music-folder/live-music",
        "https://upstairs.ca/events/"
    ]

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini-search-preview",
        web_search_options: {
            user_location: {
                type: "approximate",
                approximate: {
                    country: "CA",
                    city: "Victoria",
                    region: "BC",
                },
            },
            search_context_size: "medium",
        },
        messages: [
            {
                role: "system",
                content: 
                    `You are an expert at finding concerts in Victoria, BC. 
                    - Search the provided websites to find upcoming concerts in Victoria, BC.
                    - Return a JSON array of concert objects with no duplicates. Do not duplicate artists, just use the first artist found.
                    - Only include concerts in Victoria, BC.
                    - Format each concert as follows:
                    
                    {
                        "artist": {
                            "name": "", // Clean artist name only
                        },
                        "date": "", // YYYY-MM-DD format
                        "venue": "",
                    }
                    
                    - Keep artist names with "&" as one artist
                    - Only include real musical artists
                    - Return up to 50 concerts
                    - Only return the JSON array, no additional text

                    Here is the list of websites to help you find the concerts:
                    ${websites.join("\n")}
                `,
            },
        ],
    });

    const result = response.choices[0].message.content;
    console.log(response);

    if (result !== null) {
        fs.writeFileSync("concerts.json", result);
    }
}

getConcertsInVictoria();
