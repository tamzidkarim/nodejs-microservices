import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import MovieService from '@/services/movie.service';

class MovieController {
  public movieService = new MovieService();
  public getMovies = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    try {
      const movies = await this.movieService.findAllMovies(user.userId);

      res.status(200).json({ data: movies, message: 'List of all movies' });
    } catch (error) {
      next(error);
    }
  };
  public createMovie = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const user = req.user;

    try {
      const movie = await this.movieService.createMovie(title, user.userId);
      res.status(201).json({ data: movie, message: `Movie '${title}' has been successfully added` });
    } catch (error) {
      next(error);
    }
  };
}

export default MovieController;
