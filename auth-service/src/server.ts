import express from 'express';
import { NextFunction, Response, Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import { authFactory, AuthError } from './auth';

const PORT = 8888;
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var. Set it and restart the server');
}

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors({ origin: '*', credentials: true }));

app.post('/auth', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return res.status(400).json({ error: 'invalid payload' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'invalid payload' });
  }

  try {
    const token = auth(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.use((error: Error, _1: Request, res: Response) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );

  return res.status(500).json({ error: 'internal server error' });
});

app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});
