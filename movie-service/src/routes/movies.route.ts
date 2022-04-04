import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import MovieController from '@/controllers/movie.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import rbacMiddleware from '@/middlewares/rbac.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateMovieDto } from '@/dtos/movies.dto';

class MovieRoute implements Routes {
  public path = '/movies';
  public router = Router();
  public movieController = new MovieController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.movieController.getMovies);
    this.router.post(`${this.path}`, authMiddleware, rbacMiddleware, validationMiddleware(CreateMovieDto, 'body'), this.movieController.createMovie);
  }
}

export default MovieRoute;
