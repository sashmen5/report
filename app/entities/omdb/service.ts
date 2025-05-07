import axios from 'redaxios';

class OMDBService {
  constructor() {}

  async search(imdbId: string) {
    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`;
    const result = await axios.get<OMDB.Movie>(url);
    return result.data;
  }

  async searchByIds(imdbIds: string[]) {
    const results = await Promise.all(imdbIds.map(id => this.search(id)));
    return results;
  }
}

const omdbService = new OMDBService();

export { omdbService, OMDBService };
