CREATE TABLE tree (
  tree_id int unsigned NOT NULL,
  tree_type int NOT NULL,
  tree_name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  tree_content longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  tree_path varchar(200) COLLATE utf8mb4_bin NOT NULL,
  delete_yn char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'N',
  created_datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_datetime datetime DEFAULT NULL,
  deleted_datetime datetime DEFAULT NULL,
  user_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (user_id,tree_id),
  KEY tree_user_parent_IDX (user_id,tree_id,tree_path) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;