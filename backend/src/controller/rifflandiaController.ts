import express from "express";
import { RifflandiaService } from "../services/rifflandiaService";
import { ResponseUtils } from "../utils/responseUtils";

export const rifflandiaRouter = express.Router();
const rifflandiaService = RifflandiaService.getInstance();

rifflandiaRouter.route("/rifflandia").get(async (req, res) => {
  try {
    const gigs = await rifflandiaService.getGigs();
    res.json(ResponseUtils.success(gigs));
  } catch (error) {
    console.error("Error fetching Rifflandia gigs:", error);
    res.status(500).json(ResponseUtils.error("Failed to fetch Rifflandia gigs"));
  }
});

rifflandiaRouter.route("/rifflandia-create").post(async (req, res) => {
  try {
    const { token, user_id, numTopTracks, days } = req.body;
    const url = await rifflandiaService.createPlaylist({
      token,
      user_id,
      numTopTracks,
      days,
    });
    res.status(201).json(ResponseUtils.success(url));
  } catch (error) {
    console.error("Error creating Rifflandia playlist:", error);
    res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to create playlist"));
  }
});
