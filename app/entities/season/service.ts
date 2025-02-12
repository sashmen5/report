import { SeasonDTO, SeasonStatus, SeasonTable } from '../../models/season.schema';

export interface WatchedEpisodePostParams {
  episodeId: number;
  serieId: number;
  seasonId: number;
}

class SeasonService {
  constructor() {}

  async getBySerieId(serieId: number): Promise<SeasonStatus[] | null> {
    return await SeasonTable.find({ serieId }).exec();
  }

  async watchSerie({ serieId, seasonId, episodeId }: WatchedEpisodePostParams) {
    let season = await SeasonTable.findOne({ id: seasonId, serieId });
    if (!season || !season.episodes) {
      season = new SeasonTable({
        id: seasonId,
        serieId: serieId,
        episodes: new Map(),
      });
    }

    season?.episodes?.set(episodeId.toString(10), {
      id: episodeId,
      date: Date.now(), // Current timestamp for when the episode was watched
    });

    return await season?.save();
  }

  async dewatchEpisode({ episodeId, seasonId, serieId }: WatchedEpisodePostParams) {
    const season = await SeasonTable.findOne({ id: seasonId, serieId: serieId });
    if (!season) {
      return null;
    }

    // Delete the episode from the map
    season.episodes?.delete(episodeId.toString(10));

    // If the season has no more episodes, remove the entire season document
    if (season.episodes?.size === 0) {
      await SeasonTable.deleteOne({ _id: season._id });
      return null;
    }

    return await season.save();
  }
}

const seasonService = new SeasonService();
export { seasonService, SeasonService };
