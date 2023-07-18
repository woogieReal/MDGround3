import { appLogger } from "../utils/common/loggerUtil";
import { RedisClientOptions, RedisClientType, createClient } from "redis";

export default class RedisConnection {
  private static redisOptions: RedisClientOptions = {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  };

  static createRedisClinet() {
    return createClient(this.redisOptions);
  }

  static async redisExecutor(
    callback: (
      redisClient: ReturnType<typeof createClient>
    ) => Promise<any> | void
  ) {
    let redisClient;
    let result: any;
    
    try {
      redisClient = this.createRedisClinet();
      await redisClient.connect();
  
      result = await callback(redisClient);
    } catch (err) {
      appLogger.error(err);
      throw err;
    } finally {
      if (redisClient) redisClient.disconnect();
    }
    return result;
  }
}
