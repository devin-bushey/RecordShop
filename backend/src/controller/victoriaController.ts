import express from "express";
import { VictoriaService } from "../services/victoriaService";
import { ResponseUtils } from "../utils/responseUtils";
import { AppError, ValidationError, NotFoundError, DatabaseError } from "../utils/errorUtils";

export const victoriaRouter = express.Router();
const victoriaService = VictoriaService.getInstance();

victoriaRouter.route("/artists").get(async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city || typeof city !== 'string') {
      return res.status(400).json(ResponseUtils.error("City parameter is required"));
    }

    const gigs = await victoriaService.getGigs(city as string);
    res.json(ResponseUtils.success(gigs));
  } catch (error) {
    console.error("Error fetching Victoria gigs:", error);
    
    if (error instanceof ValidationError) {
      res.status(400).json(ResponseUtils.error(error.message));
    } else if (error instanceof NotFoundError) {
      res.status(404).json(ResponseUtils.error(error.message));
    } else if (error instanceof DatabaseError) {
      res.status(500).json(ResponseUtils.error(error.message));
    } else {
      res.status(500).json(ResponseUtils.error("Failed to fetch Victoria gigs"));
    }
  }
});

victoriaRouter.route("/create").post(async (req, res) => {
  try {
    const { token, city, user_id, numTopTracks, sortBy, overrideGigs } = req.body;

    if (!city) {
      return res.status(400).json(ResponseUtils.error("City is required"));
    }

    const url = await victoriaService.createPlaylist({
      token,
      city,
      user_id,
      numTopTracks,
      sortBy,
      overrideGigs,
    });

    res.status(201).json(ResponseUtils.success(url));
  } catch (error) {
    console.error("Error creating Victoria playlist:", error);
    
    if (error instanceof ValidationError) {
      res.status(400).json(ResponseUtils.error(error.message));
    } else if (error instanceof NotFoundError) {
      res.status(404).json(ResponseUtils.error(error.message));
    } else if (error instanceof DatabaseError) {
      res.status(500).json(ResponseUtils.error(error.message));
    } else {
      res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to create playlist"));
    }
  }
});
