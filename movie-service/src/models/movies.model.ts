import { model, Schema, Document } from 'mongoose';
import { Movie } from '@/interfaces/movies.interface';

const movieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    release: String,
    genre: String,
    director: String,
    userId: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const movieModel = model<Movie & Document>('Movie', movieSchema);

export default movieModel;
