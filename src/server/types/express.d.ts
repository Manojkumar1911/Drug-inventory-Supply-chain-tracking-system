
import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      body: {
        user?: {
          id: string;
          email: string;
          role: string;
          [key: string]: any;
        } & JwtPayload;
        [key: string]: any;
      };
    }
  }
}
