import mysql, { Connection, ConnectionOptions } from "mysql2/promise";
import { appLogger } from "../utils/common/loggerUtil";
import { RedisClientOptions, RedisClientType, createClient } from "redis";

export default class DBConnection {
  private static rdsOptions: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  };

  private static redisOptions: RedisClientOptions = {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  };

  static async transactionExecutor(
    callback: (
      connection: Connection,
      redisClient: ReturnType<typeof createClient>
    ) => Promise<any> | void,
    option?: {
      useRedis?: boolean
    }
  ) {
    let redisClient;
    let connection;
    let result: any;
    
    try {
      if (option) {
        const { useRedis } = option;
        if (useRedis) {
          redisClient = createClient(this.redisOptions);
          await redisClient.connect();
        }
      }
  
      connection = await mysql.createConnection(this.rdsOptions);  
      await connection.beginTransaction();

      result = await callback(connection, redisClient!);
      await connection.commit();
    } catch (err) {
      appLogger.error(err);
      if (connection) await connection.rollback();
      throw err;
    } finally {
      if (connection) connection.end();
      if (redisClient) redisClient.disconnect();
    }
    return result;
  }
}
