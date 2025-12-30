CREATE TABLE inuminati.users
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

CREATE TABLE inuminati.follows
(
    follower_user_id         CHAR(36)        NOT NULL COMMENT 'フォローしているユーザーID',
    following_user_id        CHAR(36)        NOT NULL COMMENT 'フォローされているユーザーID',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    PRIMARY KEY (follower_user_id, following_user_id),
    FOREIGN KEY (follower_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_follow CHECK (follower_user_id != following_user_id)
) COMMENT '[TRANSACTIONAL] フォロー'
;
