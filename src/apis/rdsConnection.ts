import mysql, { Connection, ConnectionOptions } from "mysql2/promise";
import { appLogger } from "../utils/common/loggerUtil";
import { RedisClientOptions, RedisClientType, createClient } from "redis";
import RedisConnection from "./redisConnection";

export default class RDSConnection {
  private static rdsOptions: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  };

  static async transactionExecutor(
    callback: (connection: Connection) => Promise<any> | void
  ) {
    let connection: Connection = await mysql.createConnection(this.rdsOptions);
    let result: any;

    await connection.beginTransaction();
    
    try {
      result = await callback(connection);
      await connection.commit();
    } catch (err) {
      appLogger.error(err);
      await connection.rollback();
      console.log(err);
      throw err;
    } finally {
      connection.end();
    }
    return result;
  }

  static async transactionExecutorWithRedis(
    callback: (
      connection: Connection,
      redisClient: ReturnType<typeof createClient>
    ) => Promise<any> | void
  ) {
    let connection: Connection = await mysql.createConnection(this.rdsOptions);
    let redisClient = RedisConnection.createRedisClinet();
    let result: any;
    
    try {
      await connection.beginTransaction();
      await redisClient.connect();

      result = await callback(connection, redisClient);
      await connection.commit();
    } catch (err) {
      appLogger.error(err);
      await connection.rollback();
      throw err;
    } finally {
      connection.end();
      redisClient.disconnect();
    }
    return result;
  }
}
