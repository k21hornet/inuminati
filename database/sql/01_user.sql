CREATE TABLE inuminati_db.users
(
    user_id             CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT 'ユーザーID',
    user_name           VARCHAR(50)     NOT NULL UNIQUE COMMENT 'ユーザー名',
    nickname            VARCHAR(50)     NOT NULL        COMMENT 'ニックネーム',
    email               VARCHAR(255)    NOT NULL UNIQUE COMMENT 'メールアドレス',
    self_introduction   VARCHAR(255)                    COMMENT '自己紹介文',
    profile_image_url   VARCHAR(255)                    COMMENT 'プロフィール画像URL',
    birth_date          DATE                            COMMENT '生年月日',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL
) COMMENT '[TRANSACTIONAL] ユーザー'
;
