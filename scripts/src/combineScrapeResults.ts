import * as fs from 'fs';
import path from 'path';

// Function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

// Function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
  }
};

// Function to check if two gigs are duplicates
const isDuplicate = (gig1: any, gig2: any) => {
  // Check if artist names are similar (case insensitive)
  const artistNameSimilar = gig1.artist.name.toLowerCase() === gig2.artist.name.toLowerCase();
  
  // Check if venues are similar (case insensitive)
  // const venueSimilar = gig1.venue.toLowerCase() === gig2.venue.toLowerCase();
  
  
  // Consider it a duplicate if artist and venue match, or if artist and date match
  // return (artistNameSimilar && venueSimilar) || (artistNameSimilar && datesSimilar);
  return artistNameSimilar;
};

// Main function to combine results and remove duplicates
const combineResults = () => {
  // Get file paths from command line arguments or use defaults
  const songkickFilePath = process.argv[2] || path.join(process.cwd(), 'extractedSongkickGigs.json');
  const lampPostFilePath = process.argv[3] || path.join(process.cwd(), 'extractedLampPostGigs.json');
  const outputFilePath = process.argv[4] || path.join(process.cwd(), 'extractedVicGigs.json');
  
  console.log(`Reading Songkick data from: ${songkickFilePath}`);
  console.log(`Reading LampPost data from: ${lampPostFilePath}`);
  
  // Read data from both files
  const songkickGigs = readJsonFile(songkickFilePath);
  const lampPostGigs = readJsonFile(lampPostFilePath);
  
  console.log(`Found ${songkickGigs.length} gigs from Songkick`);
  console.log(`Found ${lampPostGigs.length} gigs from LampPost`);
  
  // Start with Songkick gigs
  const combinedGigs = [...songkickGigs];
  
  // Add LampPost gigs if they're not duplicates
  for (const lampPostGig of lampPostGigs) {
    const isDuplicateGig = combinedGigs.some(existingGig => isDuplicate(existingGig, lampPostGig));
    
    if (!isDuplicateGig) {
      combinedGigs.push(lampPostGig);
    }
  }
  
  console.log(`Combined total: ${combinedGigs.length} gigs (removed ${songkickGigs.length + lampPostGigs.length - combinedGigs.length} duplicates)`);
  
  // Write the combined results to the output file
  writeJsonFile(outputFilePath, combinedGigs);
};

// Run the function
combineResults(); 