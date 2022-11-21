ALTER TABLE tree COLLATE=utf8mb4_unicode_ci;
ALTER TABLE tree MODIFY COLUMN tree_name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE tree MODIFY COLUMN tree_content longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
ALTER TABLE tree MODIFY COLUMN tree_path varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE tree MODIFY COLUMN delete_yn char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'N' NOT NULL;
ALTER TABLE tree MODIFY COLUMN user_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;