import { get } from "../http/request";
import { CreateNewPlaylistJamBase } from "../helpers/jamBase/createPlaylist";
import { Countries, States, Metros } from "../types/jamBase/Geographies";

const API_KEY_JAMBASE = process.env.API_KEY_JAMBASE || "";

export interface JamBaseCreatePlaylistParams {
  token: string;
  city: string;
  user_id: string;
  numTopTracks: number;
  days?: string[];
}

export interface JamBaseEvent {
  id: string;
  artistName: string;
  spotifyId: string;
  venue: string;
  date: string;
  link: string;
  image: string;
  location: string;
}

export class JamBaseService {
  private static instance: JamBaseService;
  private cachedData: {
    geo_countries?: Countries;
    geo_states?: States;
    geo_metros?: Metros;
  } = {};

  private constructor() {}

  public static getInstance(): JamBaseService {
    if (!JamBaseService.instance) {
      JamBaseService.instance = new JamBaseService();
    }
    return JamBaseService.instance;
  }

  async getCountries(): Promise<Countries> {
    if (this.cachedData.geo_countries) {
      return this.cachedData.geo_countries;
    }

    try {
      const { data } = await get({
        url: "https://www.jambase.com/jb-api/v1/geographies/countries",
        params: {
          countryHasUpcomingEvents: "true",
          apikey: API_KEY_JAMBASE,
        },
      });
      this.cachedData.geo_countries = {
        countries: data.countries,
      };
      return this.cachedData.geo_countries;
    } catch (error) {
      throw new Error("Failed to fetch countries");
    }
  }

  async getStates(): Promise<States> {
    if (this.cachedData.geo_states) {
      return this.cachedData.geo_states;
    }

    try {
      const { data } = await get({
        url: "https://www.jambase.com/jb-api/v1/geographies/states",
        params: { stateHasUpcomingEvents: "true", apikey: API_KEY_JAMBASE },
      });
      this.cachedData.geo_states = {
        states: data.states,
      };
      return this.cachedData.geo_states;
    } catch (error) {
      throw new Error("Failed to fetch states");
    }
  }

  async getMetros(): Promise<Metros> {
    if (this.cachedData.geo_metros) {
      return this.cachedData.geo_metros;
    }

    try {
      const { data } = await get({
        url: "https://www.jambase.com/jb-api/v1/geographies/metros",
        params: { metroHasUpcomingEvents: "true", apikey: API_KEY_JAMBASE },
      });
      this.cachedData.geo_metros = {
        metros: data.metros,
      };
      return this.cachedData.geo_metros;
    } catch (error) {
      throw new Error("Failed to fetch metros");
    }
  }

  async getEvents(city: string): Promise<JamBaseEvent[]> {
    const cityId = await this.getCityId(city);
    if (!cityId) {
      throw new Error("City not found");
    }

    try {
      const httpResponse = await get({
        maxBodyLength: Infinity,
        url: `https://www.jambase.com/jb-api/v1/events?apikey=${API_KEY_JAMBASE}&eventType=concert&geoCityId=${cityId}&geoRadiusAmount=30&geoRadiusUnits=km&expandExternalIdentifiers=true`,
      });

      return this.formatJamBase(httpResponse.data);
    } catch (error) {
      throw new Error("Failed to fetch events");
    }
  }

  async createPlaylist(params: JamBaseCreatePlaylistParams): Promise<string> {
    const { token, city, user_id, numTopTracks, days } = params;
    const events = await this.getEvents(city);
    const spotifyIds = this.getSpotifyIds(events);

    const url = await CreateNewPlaylistJamBase({
      token,
      city,
      user_id,
      numTopTracks,
      spotifyIds,
    });

    if (!url) {
      throw new Error("Failed to create playlist");
    }

    return url;
  }

  private async getCityId(city: string): Promise<string | null> {
    try {
      const response = await get({
        url: "https://www.jambase.com/jb-api/v1/geographies/cities",
        params: { geoCityName: city, apikey: API_KEY_JAMBASE },
      });
      return response.data.cities[0]?.identifier || null;
    } catch (error) {
      return null;
    }
  }

  private formatJamBase(data: any): JamBaseEvent[] {
    const responseObject: JamBaseEvent[] = [];

    if (!data.events) {
      return responseObject;
    }

    data.events.forEach((event: any, index: number) => {
      event.performer.forEach((performer: any) => {
        let spotifyId = null;

        for (const externalIdentifier of performer["x-externalIdentifiers"]) {
          if (externalIdentifier.source === "spotify") {
            spotifyId = externalIdentifier.identifier[0];
          }
        }

        responseObject.push({
          id: spotifyId + index,
          artistName: performer.name,
          spotifyId: spotifyId,
          venue: event.location.name,
          date: this.formatDate(event.startDate),
          link: `https://open.spotify.com/artist/${spotifyId}`,
          image: performer.image,
          location: `${event.location.address.addressLocality}, ${event.location.address.addressRegion.alternateName}`,
        });
      });
    });

    return responseObject;
  }

  private formatDate(utc: string): string {
    const inputDate = new Date(utc);
    const pacificTimeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return pacificTimeFormatter.format(inputDate);
  }

  private getSpotifyIds(events: JamBaseEvent[]): string[] {
    return events.map(event => event.spotifyId).filter(Boolean);
  }
} 