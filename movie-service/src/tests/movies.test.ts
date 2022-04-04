import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import MovieRoute from '../routes/movies.route';
import { getInvalidToken, getToken, moviesList } from './mocks';
import movieModel from '../models/movies.model';

const basicToken = getToken('basic');
const premiumToken = getToken('premium');

const createMovie = (app, title, token) => {
  return request(app.getServer()).post('/movies').set('Authorization', token).send({ title });
};

const getMovie = (app, token) => {
  return request(app.getServer()).get('/movies').set('Authorization', token);
};

describe('Testing Movie', () => {
  beforeAll(() => {
    movieModel.deleteMany({});
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  describe('[GET] /movies', () => {
    const movieRoute = new MovieRoute();
    const app = new App([movieRoute]);
    it('should return user movies. Should be equal 1', async () => {
      await movieModel.deleteMany({});
      await Promise.all([createMovie(app, 'Batman', basicToken), createMovie(app, 'Superman', premiumToken)]);
      const res = await getMovie(app, basicToken);
      expect(res.body.data?.length).toBe(1);
    });
  });
  describe('POST /api/v0/movies', () => {
    const movieRoute = new MovieRoute();
    const app = new App([movieRoute]);

    it('should add movie', async () => {
      const res = await createMovie(app, 'Marvel', basicToken);
      const movies = await movieModel.find();
      expect(res.status).toBe(201);
      expect(movies.length).toBe(1);
    });

    it('should return 400 and error message if title is empty', async () => {
      const res = await createMovie(app, '', basicToken);
      expect(res.status).toBe(400);
    });

    it('should return 409 and error message if movie with this title has been already added', async () => {
      await createMovie(app, 'Marvel', basicToken);
      await getMovie(app, basicToken);
      const res = await createMovie(app, 'Marvel', basicToken);
      expect(res.status).toBe(409);
    });

    it('should return 404 and error message if movie was not found', async () => {
      const res = await createMovie(app, 'dsadasdASDasd', basicToken);
      expect(res.status).toBe(404);
    });

    // it('should return 500 and error message if OMDB API KEY is not provided', async () => {
    //   process.env.OMDB_API_KEY = undefined;
    //   const res = await createMovie(app, 'Marvel', basicToken);
    //   expect(res.status).toBe(500);
    // });
  });
  describe('Auth Middlewares', () => {
    const movieRoute = new MovieRoute();
    const app = new App([movieRoute]);
    it('should return 401 if Authorization header is empty or not attached', async () => {
      const res = await request(app.getServer()).get('/movies');
      expect(res.status).toBe(401);
    });

    it('should return 401 if token is expired', async () => {
      const res = await getMovie(app, getInvalidToken('expiresIn'));
      expect(res.status).toBe(401);
    });

    it('should return 401 if token secret is incorrect', async () => {
      const res = await getMovie(app, getInvalidToken('secret'));
      expect(res.status).toBe(401);
    });

    it('should return 403 if basic user tries to add more than 5 books per calendar month', async () => {
      await Promise.all(Array.from({ length: 5 }, (_, i) => createMovie(app, moviesList[i], basicToken)));
      const res = await createMovie(app, 'Avengers', basicToken);
      expect(res.status).toBe(403);
    });

    it('should allow premium user to add more than 5 books per calendar month', async () => {
      await Promise.all(Array.from({ length: 5 }, (_, i) => createMovie(app, moviesList[i], premiumToken)));
      const res = await createMovie(app, 'Avengers', premiumToken);
      expect(res.status).toBe(201);
    });

    it('should authorize basic user', async () => {
      const res = await getMovie(app, basicToken);
      expect(res.status).toBe(200);
    });

    it('should authorize premium user', async () => {
      const res = await getMovie(app, premiumToken);
      expect(res.status).toBe(200);
    });
  });
  afterEach(() => movieModel.deleteMany({}));
});
