import express from "express";
import { JamBaseService } from "../services/jamBaseService";
import { ResponseUtils } from "../utils/responseUtils";

export const jamBaseRouter = express.Router();
const jamBaseService = JamBaseService.getInstance();

jamBaseRouter.route("/geographies/countries").get(async (req, res) => {
  try {
    const countries = await jamBaseService.getCountries();
    res.json(ResponseUtils.success(countries));
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json(ResponseUtils.error("Failed to fetch countries"));
  }
});

jamBaseRouter.route("/geographies/states").get(async (req, res) => {
  try {
    const states = await jamBaseService.getStates();
    res.json(ResponseUtils.success(states));
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json(ResponseUtils.error("Failed to fetch states"));
  }
});

jamBaseRouter.route("/geographies/metros").get(async (req, res) => {
  try {
    const metros = await jamBaseService.getMetros();
    res.json(ResponseUtils.success(metros));
  } catch (error) {
    console.error("Error fetching metros:", error);
    res.status(500).json(ResponseUtils.error("Failed to fetch metros"));
  }
});

jamBaseRouter.route("/jamBase").get(async (req, res) => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      return res.status(400).json(ResponseUtils.error("City parameter is required"));
    }

    const events = await jamBaseService.getEvents(city);
    res.json(ResponseUtils.success(events));
  } catch (error) {
    console.error("Error fetching JamBase events:", error);
    if (error instanceof Error && error.message === "City not found") {
      res.status(404).json(ResponseUtils.error("City not found"));
    } else {
      res.status(500).json(ResponseUtils.error("Failed to fetch events"));
    }
  }
});

jamBaseRouter.route("/createJamBase").post(async (req, res) => {
  try {
    const { token, city, user_id, numTopTracks, days } = req.body;

    if (!city) {
      return res.status(400).json(ResponseUtils.error("City is required"));
    }

    const url = await jamBaseService.createPlaylist({
      token,
      city,
      user_id,
      numTopTracks,
      days,
    });

    res.status(201).json(ResponseUtils.success(url));
  } catch (error) {
    console.error("Error creating JamBase playlist:", error);
    if (error instanceof Error && error.message === "City not found") {
      res.status(404).json(ResponseUtils.error("City not found"));
    } else {
      res.status(500).json(ResponseUtils.error(error instanceof Error ? error.message : "Failed to create playlist"));
    }
  }
});
