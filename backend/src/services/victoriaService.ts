import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";
import { Gig } from "../types/Gig";
import { CreateNewPlaylist } from "../helpers/createPlaylist";
import { AppError, DatabaseError, ValidationError, NotFoundError } from "../utils/errorUtils";

export interface VictoriaCreatePlaylistParams {
  token: string;
  city: string;
  user_id: string;
  numTopTracks: number;
  sortBy?: "date" | "popularity";
  overrideGigs?: Gig[];
}

export class VictoriaService {
  private static instance: VictoriaService;
  private constructor() {}

  public static getInstance(): VictoriaService {
    if (!VictoriaService.instance) {
      VictoriaService.instance = new VictoriaService();
    }
    return VictoriaService.instance;
  }

  async getGigs(city: string): Promise<Gig[]> {
    try {
      if (!city || typeof city !== 'string') {
        throw new ValidationError("City parameter is required");
      }

      const db_connect = await connectToDatabase();
      const collection: Collection<Gig> = db_connect.collection(city);
      const gigs = await collection.find({}).toArray();

      if (!gigs || gigs.length === 0) {
        throw new NotFoundError(`No gigs found for city: ${city}`);
      }

      return gigs;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new DatabaseError(`Failed to fetch gigs for city: ${city}`);
    }
  }

  async createPlaylist(params: VictoriaCreatePlaylistParams): Promise<string> {
    try {
      const { token, city, user_id, numTopTracks, sortBy, overrideGigs } = params;

      if (!city || typeof city !== 'string') {
        throw new ValidationError("City is required");
      }

      if (!token || typeof token !== 'string') {
        throw new ValidationError("Token is required");
      }

      if (!user_id || typeof user_id !== 'string') {
        throw new ValidationError("User ID is required");
      }

      if (!numTopTracks || typeof numTopTracks !== 'number') {
        throw new ValidationError("Number of top tracks is required and must be a number");
      }

      let gigs: Gig[] = [];
      if (overrideGigs) {
        gigs = overrideGigs;
      } else {
        gigs = await this.getGigs(city);
      }

      const url = await CreateNewPlaylist({
        token,
        city,
        user_id,
        numTopTracks,
        gigs,
        sortBy,
      });

      if (!url) {
        throw new Error("Failed to create playlist");
      }

      return url;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error("Failed to create playlist");
    }
  }
} 