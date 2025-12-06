CREATE TABLE inuminati_db.users
(
    user_id           BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ユーザーID',
    user_name           VARCHAR(255)    NOT NULL        COMMENT 'ユーザー名',
    email               VARCHAR(255)    NOT NULL UNIQUE COMMENT 'メールアドレス',
    self_introduction   VARCHAR(255)                    COMMENT '自己紹介文',
    profile_image_url   VARCHAR(255)                    COMMENT 'プロフィール画像URL',
    header_image_url    VARCHAR(255)                    COMMENT 'ヘッダー画像URL',
    birth_date          DATE                            COMMENT '生年月日',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    deleted_at          DATETIME       
) COMMENT '[TRANSACTIONAL] ユーザー'
;
