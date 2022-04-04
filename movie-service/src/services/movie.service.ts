import { HttpException } from '@exceptions/HttpException';
import movieModel from '@/models/movies.model';
import { isEmpty } from '@utils/util';
import axios from 'axios';
import { OMDB_API_KEY } from '@/config';
import { Movie } from '@/interfaces/movies.interface';

class MovieService {
  public movies = movieModel;
  public async findAllMovies(userId: number): Promise<Movie[]> {
    const movies: Movie[] = await this.movies.find({ userId });
    return movies.map((movie: any) => (({ userId, __v, createdAt, updatedAt, ...movieInfo }) => movieInfo)(movie.toJSON()));
  }

  public async createMovie(title: string, userId: number): Promise<Movie> {
    if (isEmpty(title)) throw new HttpException(400, 'Title is empty.');

    const { data } = await axios.get(`http://www.omdbapi.com?apikey=${OMDB_API_KEY}&t=${title}`);
    const movie = (({ Title, Released, Genre, Director }) => ({
      title: Title,
      release: new Date(Released),
      genre: Genre,
      director: Director,
    }))(data);

    if (!movie || !movie?.title) throw new HttpException(404, `Cannot find movie with this title: ${title}`);

    const findMovie: Movie = await this.movies.findOne({ title: movie.title, userId });
    if (findMovie) throw new HttpException(409, `You have already added movie with title '${title}'`);

    const createMovieData = await this.movies.create({ ...movie, userId });

    return createMovieData;
  }
}

export default MovieService;
