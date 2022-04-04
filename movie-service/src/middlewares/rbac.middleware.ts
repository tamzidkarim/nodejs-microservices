import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@/utils/logger';
import { getFirstLastDay } from '@/utils/util';
import movieModel from '@models/movies.model';
import { ROLES } from '@/config/constants';

const rbacMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    if (user.role === ROLES.BASIC) {
      const filter = { createdAt: { $gte: getFirstLastDay(0), $lte: getFirstLastDay(1) }, userId: user.userId };
      const totalBooksPerMonth = await movieModel.countDocuments(filter);

      if (totalBooksPerMonth > 4) {
        return res.status(403).send({ message: `Your limit is over` });
      }
    }
  } catch (error) {
    logger.error(`Error in RBAC middleware: ${error}`);
    next(new HttpException(500, 'Error occurred'));
  }
  next();
};

export default rbacMiddleware;
