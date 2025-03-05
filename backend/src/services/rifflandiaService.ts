import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";
import { Gig } from "../types/Gig";
import { CreateNewPlaylistRifflandia } from "../helpers/rifflandia/createPlaylist";
import { cachedGigs } from "../cache/gigsCache";

const RIFFLANDIA = "rifflandia";

export interface RifflandiaCreatePlaylistParams {
  token: string;
  user_id: string;
  numTopTracks: number;
  days?: string[];
}

export class RifflandiaService {
  private static instance: RifflandiaService;
  private constructor() {}

  public static getInstance(): RifflandiaService {
    if (!RifflandiaService.instance) {
      RifflandiaService.instance = new RifflandiaService();
    }
    return RifflandiaService.instance;
  }

  async getGigs(): Promise<Gig[]> {
    if (cachedGigs.cachedRifflandiaGigs) {
      return cachedGigs.cachedRifflandiaGigs;
    }

    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(RIFFLANDIA);
    const gigs: Gig[] = await collection.find({}).toArray();

    cachedGigs.cachedRifflandiaGigs = gigs;
    return gigs;
  }

  async createPlaylist(params: RifflandiaCreatePlaylistParams): Promise<string> {
    const { token, user_id, numTopTracks, days = [] } = params;

    let dayQuery;
    let sortBy;

    if (!days || days.length === 0) {
      sortBy = "orderNum";
      dayQuery = {};
    } else {
      sortBy = "day";
      dayQuery = {
        day: {
          $in: days,
        },
      };
    }

    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(RIFFLANDIA);
    const gigs: Gig[] = await collection.find(dayQuery).toArray();

    const url = await CreateNewPlaylistRifflandia({
      token,
      user_id,
      numTopTracks,
      artists: gigs,
      sortBy,
      days,
    });

    if (!url) {
      throw new Error("Failed to create playlist");
    }

    return url;
  }
} 