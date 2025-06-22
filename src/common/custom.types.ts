/* eslint-disable @typescript-eslint/no-namespace */
import { IAuthUser } from './enums';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
