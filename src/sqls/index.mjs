import mysql from 'mysql2/promise';
import path from 'path';
import fs from  'fs';
import dotenv from 'dotenv';

dotenv.config();

const getRawSqlClient = async () => {
	const options = {
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_ROOT_PASSWORD,
		database: process.env.MYSQL_DATABASE,
	};

	return await mysql.createConnection(options);
}

const PROD_PATH = path.join('src', 'sqls', 'prod');
const DEV_PATH = path.join('src', 'sqls', 'dev');

const prodSqlFileNames = fs.readdirSync(PROD_PATH);
const devSqlFileNames = fs.readdirSync(DEV_PATH);

const migrateType = process.argv[2];
const connection = await getRawSqlClient();

if (migrateType === 'clean') {
	await connection.query(`DROP DATABASE ${process.env.MYSQL_DATABASE}`);
	await connection.query(`CREATE DATABASE ${process.env.MYSQL_DATABASE}`);
} else {
	let migrationFileNames = prodSqlFileNames;
	if (migrateType === 'dev') {
		migrationFileNames = migrationFileNames.concat(devSqlFileNames);
	}
	migrationFileNames.sort();

	for (const fileName of migrationFileNames) {
		try {
			const isDevFile = fileName.split('-')[0].split('_')[2] > 100;
			const fileFullPath = path.join(isDevFile ? DEV_PATH : PROD_PATH, fileName);
			const fileContent = fs.readFileSync(fileFullPath).toString();
			await connection.query(fileContent);
			console.log('Success', fileName)
		} catch (err) {
			console.log('Fail', fileName)
			throw err;
		}
	}
}

process.exit(1);