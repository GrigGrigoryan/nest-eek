import { IUser } from '../modules/user/user.types';
import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user: IUser;
}
