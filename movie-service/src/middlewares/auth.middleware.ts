import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import { logger } from '@/utils/logger';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = verify(Authorization, secretKey) as User;

      if (verificationResponse) {
        req.user = verificationResponse;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(401, 'Authorization error'));
  }
};

export default authMiddleware;
