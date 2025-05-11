
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

interface SystemLog {
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  module?: string;
  details?: any;
}

export class SystemMonitor {
  private db: Db | null = null;
  private logsCollection: Collection<SystemLog> | null = null;

  constructor(private mongoUrl: string) {}

  async connect() {
    try {
      const client = new MongoClient(this.mongoUrl);
      await client.connect();
      this.db = client.db('systemMonitoring');
      this.logsCollection = this.db.collection<SystemLog>('logs');
      console.log('Connected to MongoDB for system monitoring');
      return true;
    } catch (error) {
      console.error('Failed to connect to MongoDB for monitoring:', error);
      return false;
    }
  }

  async logEvent(event: Omit<SystemLog, 'timestamp'>) {
    try {
      if (!this.logsCollection) {
        throw new Error('Database not connected');
      }
      
      const logEntry: SystemLog = {
        ...event,
        timestamp: new Date()
      };
      
      await this.logsCollection.insertOne(logEntry);
      return true;
    } catch (error) {
      console.error('Failed to log event:', error);
      return false;
    }
  }

  async getRecentLogs(limit: number = 100) {
    try {
      if (!this.logsCollection) {
        throw new Error('Database not connected');
      }
      
      return await this.logsCollection
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }
}
