import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";
import { Gig } from "../types/Gig";
import {
  addPlaylistItems,
  getPlaylist,
  getPlaylistItems,
  removePlaylistItems,
} from "../helpers/spotifyPlaylistHelpers";
import { sortByDate } from "../helpers/sortByDate";

export interface PlaylistUpdateParams {
  token: string;
  userId: string;
  playlistName: string;
  collectionName: string;
}

export interface PlaylistGetParams {
  token: string;
  userId: string;
  playlistName: string;
}

export interface PlaylistAddTrackParams {
  token: string;
  playlistId: string;
  trackId: string;
}

export class PlaylistService {
  private static instance: PlaylistService;
  private constructor() {}

  public static getInstance(): PlaylistService {
    if (!PlaylistService.instance) {
      PlaylistService.instance = new PlaylistService();
    }
    return PlaylistService.instance;
  }

  async updatePlaylist(params: PlaylistUpdateParams): Promise<number> {
    const { token, userId, playlistName, collectionName } = params;

    const playlist = await getPlaylist({
      token,
      user_id: userId,
      playlistName,
    });

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    // Remove all existing tracks from playlist
    const tracksFromUsersPlaylist = await getPlaylistItems({ token, playlistId: playlist.id });
    await removePlaylistItems({ token, playlistId: playlist.id, tracks: tracksFromUsersPlaylist });

    // Add all future gig tracks to playlist
    const gigsFromDatabase = await this.getAllFutureGigsFromCollection(collectionName);
    if (!gigsFromDatabase?.length) {
      throw new Error("No gigs found in database collection");
    }

    return await addPlaylistItems({
      token,
      playlistId: playlist.id,
      tracks: gigsFromDatabase,
    });
  }

  async getPlaylist(params: PlaylistGetParams): Promise<{
    id: string;
    name: string;
    image: string;
    uri: string;
    tracks: any[];
  }> {
    const { token, userId, playlistName } = params;

    const playlist = await getPlaylist({
      token,
      user_id: userId,
      playlistName,
    });

    if (!playlist?.id) {
      throw new Error("Playlist not found");
    }

    const tracksFromUsersPlaylist = await getPlaylistItems({ token, playlistId: playlist.id });

    return {
      id: playlist.id,
      name: playlist.name,
      image: playlist.image,
      uri: playlist.uri,
      tracks: tracksFromUsersPlaylist,
    };
  }

  async addTrack(params: PlaylistAddTrackParams): Promise<void> {
    const { token, playlistId, trackId } = params;
    await addPlaylistItems({ token, playlistId, tracks: [trackId] });
  }

  private async getAllFutureGigsFromCollection(collectionName: string): Promise<Gig[]> {
    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(collectionName);
    const gigs = await collection.find({ date: { $gte: new Date() } }).toArray();
    return sortByDate(gigs);
  }
} 