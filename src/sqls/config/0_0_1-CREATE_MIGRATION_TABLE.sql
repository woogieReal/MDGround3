CREATE TABLE IF NOT EXISTS  migration (
	migration_id varchar(50) NOT NULL COMMENT '마이그레이션 ID',
	migration_name varchar(200) NOT NULL COMMENT '마이그레이션 이름',
	migration_file_name varchar(250) NOT NULL COMMENT '마이그레이션 파일 이름',
	checksum CHAR(32) NOT NULL,
	creation_datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '실행 일시'
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;