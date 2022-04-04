import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import MovieRoute from '@/routes/movies.route';
import { logger } from '@/utils/logger';

try {
  validateEnv();

  const app = new App([new IndexRoute(), new MovieRoute()]);

  app.listen();
} catch (error) {
  logger.error(error);
}
