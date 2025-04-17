
import { Pool } from 'pg';
import AlertModel from './Alert';
import LocationModel from './Location';
import UserModel from './User';

// This factory function creates all our models with a shared pool
export function createModels(pool: Pool) {
  return {
    Alert: new AlertModel(pool),
    Location: new LocationModel(pool),
    User: new UserModel(pool)
    // Add other models here as they're created
  };
}
