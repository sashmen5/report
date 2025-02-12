import { Model } from 'mongoose';
import { uid } from 'uid';

import { Collection, CollectionTable } from '../../models/collecton.schema';

class CollectionService {
  constructor(private collectionModel: Model<Collection>) {}

  async create(userId: string): Promise<Collection> {
    const newCollection = new this.collectionModel({
      id: uid(21),
      userId,
      movies: [],
      series: [],
      creationDate: Date.now(),
    });

    return newCollection.save();
  }

  async getByUserId(userId: string): Promise<Collection | null> {
    return this.collectionModel.findOne(
      { userId: userId },
      { __v: 0, _id: 0, 'movies._id': 0, 'series._id': 0 },
    );
  }

  async addMovie(userId: string, movieId: number, status: string) {
    await this.collectionModel.updateOne(
      { userId },
      {
        $push: {
          movies: { id: movieId, statuses: [{ name: status, date: Date.now() }] },
        },
      },
    );
  }

  async updateMovieStatus(userId: string, movieId: number, status: string) {
    await this.collectionModel.updateOne(
      { userId: userId, 'movies.id': movieId },
      { $push: { 'movies.$.statuses': { name: status, date: Date.now() } } },
    );
  }

  async addSerie(userId: string, serieId: number, status: string): Promise<any> {
    await this.collectionModel.updateOne(
      { userId },
      { $push: { series: { id: serieId, statuses: [{ name: status, date: Date.now() }] } } },
    );
  }

  async updateSerieStatus(userId: string, serieId: number, status: string): Promise<any> {
    await this.collectionModel.updateOne(
      { userId, 'series.id': serieId },
      { $push: { 'series.$.statuses': { name: status, date: Date.now() } } },
    );
  }
}

const collectionService = new CollectionService(CollectionTable);
export { collectionService, CollectionService };
