import OpenAI from 'openai';
import 'dotenv/config'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CleanedArtist {
  name: string;
  isRealArtist: boolean;
}

export type CleanedArtistsMap = { [key: string]: CleanedArtist[] };

export async function cleanArtistNames(artistNames: string[]): Promise<CleanedArtistsMap> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a music industry expert. Your task is to:
            1. For each artist name in the input array:
              - Split multiple artist names into individual artists (split on commas, "and", or multiple artists listed together)
              - Keep artist names with "&" as one artist (e.g., "Blu & Exile" is one artist)
              - Clean up artist names by removing special characters and extra whitespace
              - Determine if each artist is a real musical artist (not a venue, event, or non-musical entity)
            2. Return a JSON object where:
              - Keys are the original artist names
              - Values are arrays of objects with 'name' and 'isRealArtist' properties

            Example input: ["Blu & Exile, and Jelly Roll", "Shrek Rave"]
            Example output: {
              "Blu & Exile, and Jelly Roll": [
                {"name": "Blu & Exile", "isRealArtist": true},
                {"name": "Jelly Roll", "isRealArtist": true}
              ],
              "Shrek Rave": [
                {"name": "Shrek Rave", "isRealArtist": false}
              ]
            }`
        },
        {
          role: "user",
          content: JSON.stringify(artistNames)
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error cleaning artist names:", error);
    // Fallback: return original names as real artists
    return artistNames.reduce((acc, name) => {
      acc[name] = [{ name, isRealArtist: true }];
      return acc;
    }, {} as CleanedArtistsMap);
  }
} 