import express from "express";
import { PlaylistService } from "../services/playlistService";
import { ResponseUtils } from "../utils/responseUtils";

export const playlistRouter = express.Router();
const playlistService = PlaylistService.getInstance();

/**
 * EXAMPLE USAGE:
 * 
 * NOTE: To test, create a new spotify playlist on the spotify app and name it "test"
 * 
 * curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "token": "BQBTN4ulFxi9haBiYgfUtyHGejG4Nx3xDN_nlGLJkmwmzow_4FZH2S6ljDmQrSQHs16hPzegBwhyrFWRUvlf6yeWurMr8XuN2qneHtdPJs-HrdqqjXQbyx94B4eeBmLmqdgcQs2zYSAvulf1gNWzBfGuCyla83J8acb-R3Bsb3oOjSueRFNfGhpLZmSN7jd8lWB5JMJ16V7mONgKuUFs8AT8H2m_615C4XRhvg",
    "userId": "n54pdoqawgph9ftwztxe6k77a",
    "playlistName": "test",
    "collectionName": "victoria"
  }' \
  http://localhost:5000/playlist/update
  
 */

/**
 * Currently, this endpoint will update a users playlist by deleting the existing tracks
 * then adding tracks from the recordshop database.
 *
 * Its really just a way to test the helper methods.
 *
 * Lets do something cool with this.
 *
 */
playlistRouter.route("/playlist/update").put(async (req, res) => {
  try {
    const { token, userId, playlistName, collectionName } = req.body;

    const addedTracksCount = await playlistService.updatePlaylist({
      token,
      userId,
      playlistName,
      collectionName,
    });

    res.status(200).json(
      ResponseUtils.success(`Successfully updated playlist: ${playlistName} with ${addedTracksCount} tracks`)
    );
  } catch (error) {
    console.error("Error updating playlist:", error);
    if (error instanceof Error && error.message === "Playlist not found") {
      res.status(404).json(ResponseUtils.error("Playlist not found"));
    } else if (error instanceof Error && error.message === "No gigs found in database collection") {
      res.status(404).json(ResponseUtils.error("No gigs found in database collection"));
    } else {
      res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to update playlist"));
    }
  }
});

playlistRouter.route("/playlist").get(async (req, res) => {
  try {
    const { token, userId, playlistName } = req.query;

    if (!token || !userId || !playlistName || typeof token !== 'string' || typeof userId !== 'string' || typeof playlistName !== 'string') {
      return res.status(400).json(ResponseUtils.error("Missing required parameters"));
    }

    const playlist = await playlistService.getPlaylist({
      token,
      userId,
      playlistName,
    });

    res.status(200).json(ResponseUtils.success(playlist));
  } catch (error) {
    console.error("Error fetching playlist:", error);
    if (error instanceof Error && error.message === "Playlist not found") {
      res.status(404).json(ResponseUtils.error("Playlist not found"));
    } else {
      res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to fetch playlist"));
    }
  }
});

playlistRouter.route("/playlist/track").post(async (req, res) => {
  try {
    const { token, playlistId, trackId } = req.body;

    if (!token || !playlistId || !trackId) {
      return res.status(400).json(ResponseUtils.error("Missing required parameters"));
    }

    await playlistService.addTrack({
      token,
      playlistId,
      trackId,
    });

    res.status(200).json(ResponseUtils.success(`Added track ${trackId} to playlist ${playlistId}`));
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to add track to playlist"));
  }
});
