
import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      body: {
        user?: {
          id: number;
          email: string;
          role: string;
          [key: string]: any;
        } & JwtPayload;
        [key: string]: any;
      };
    }
  }
}
