
import 'express';

declare global {
  namespace Express {
    interface Request {
      body: {
        user?: {
          id: string;
          email: string;
          role: string;
        };
        [key: string]: any;
      };
    }
  }
}
