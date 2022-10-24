import mysql, { Connection, ConnectionOptions } from "mysql2/promise";

export default class DBConnection {
  private static options: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  static async transactionExecutor(
    callback: (connection: Connection) => Promise<any> | void
  ) {
    let connection: Connection = await mysql.createConnection(this.options);
    let result: any;

    await connection.beginTransaction();

    try {
      result = await callback(connection);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.log(err);
      throw err;
    }
    return result;
  }
}
