import mysql from 'mysql2/promise';
import path from 'path';
import fs from  'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const getRawSqlClient = async () => {
	const options = {
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_ROOT_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		multipleStatements: true,
	};

	return await mysql.createConnection(options);
}

const generateChecksum = (str, algorithm, encoding) => {
	return crypto
		.createHash(algorithm || 'md5')
		.update(str, 'utf8')
		.digest(encoding || 'hex');
}

const checkIsDevFile = (fileName) => {
	return fileName.split('-')[0].split('_')[2] > 100;
}

const CONFIG_PATH = path.join('src', 'sqls', 'config');
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
	await connection.execute(fs.readFileSync(path.join(CONFIG_PATH, '0_0_1-CREATE_MIGRATION_TABLE.sql')).toString());

	const [rows, columns] = await connection.query(`
		SELECT 
			  migration_file_name AS migrationFileName
			, checksum AS checksum
		FROM migration
	`);

	let migrationFileNames = [];

	try {
		if (migrateType === 'prod') {
			migrationFileNames = migrationFileNames.concat(prodSqlFileNames);
	
			rows.forEach((migratedFile) => {
				if (!checkIsDevFile(migratedFile.migrationFileName)) {
					if (!migrationFileNames.includes(migratedFile.migrationFileName)) {
						throw new Error(`migrated file ${migratedFile.migrationFileName} does not exist`);
					}
				}
			})
		} else if (migrateType === 'dev') {
			migrationFileNames = migrationFileNames.concat(prodSqlFileNames, devSqlFileNames);
	
			rows.forEach((migratedFile) => {
				if (!migrationFileNames.includes(migratedFile.migrationFileName)) {
					throw new Error(`migrated file ${migratedFile.migrationFileName} does not exist`);
				}
			})
		}
	} catch (err) {
		console.log(err.message);
	}
	
	migrationFileNames.sort();

	for (const fileName of migrationFileNames) {
		try {
			const isDevFile = checkIsDevFile(fileName);
			const fileFullPath = path.join(isDevFile ? DEV_PATH : PROD_PATH, fileName);
			const fileContent = fs.readFileSync(fileFullPath).toString();

			const [migrationId, migrationFileName] = fileName.split('-');
			const checkSum = generateChecksum(fileContent);

			const migratedFile = rows.find((migratedFile) => migratedFile.migrationFileName === fileName);
			if (migratedFile) {
				if (migratedFile.checksum !== checkSum) {
					throw new Error(`Fail: migrated file ${migratedFile.migrationFileName} is changed`);
				} else {
					continue;
				}
			}

			await connection.beginTransaction();

			await connection.query(fileContent);
			await connection.query(`INSERT INTO migration VALUES('${migrationId}', '${migrationFileName}', '${fileName}', '${checkSum}', CURRENT_TIMESTAMP)`)

			console.log('Success:', fileName)
			await connection.commit();
		} catch (err) {
			console.log(`Fail:`, fileName)
			console.log(err.message)
			await connection.rollback();
		}
	}
}

process.exit(1);