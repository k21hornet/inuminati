CREATE TABLE inuminati_db.posts
(
    post_id             BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '投稿ID',
    user_id             BIGINT          NOT NULL        COMMENT 'ユーザーID',
    content             TEXT                            COMMENT '投稿内容',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at DESC)
) COMMENT '[TRANSACTIONAL] 投稿'
;

CREATE TABLE inuminati_db.post_images
(
    post_image_id       BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '投稿画像ID',
    post_id             BIGINT          NOT NULL        COMMENT '投稿ID',
    image_url           VARCHAR(255)    NOT NULL        COMMENT '画像URL',
    image_order         INT             NOT NULL        COMMENT '画像順番',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_image_order (post_id, image_order)
) COMMENT '[TRANSACTIONAL] 投稿画像'
;

CREATE TABLE inuminati_db.post_likes
(
    post_like_id        BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '投稿いいねID',
    post_id             BIGINT          NOT NULL        COMMENT '投稿ID',
    user_id             BIGINT          NOT NULL        COMMENT 'ユーザーID',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_like (post_id, user_id),
    INDEX idx_post (post_id)
) COMMENT '[TRANSACTIONAL] 投稿いいね'
;

CREATE TABLE inuminati_db.post_saves
(
    post_save_id        BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '投稿保存ID',
    post_id             BIGINT          NOT NULL        COMMENT '投稿ID',
    user_id             BIGINT          NOT NULL        COMMENT 'ユーザーID',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_save (post_id, user_id)
) COMMENT '[TRANSACTIONAL] 投稿保存'
;

CREATE TABLE inuminati_db.post_comments
(
    post_comment_id     BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '投稿コメントID',
    post_id             BIGINT          NOT NULL        COMMENT '投稿ID',
    user_id             BIGINT          NOT NULL        COMMENT 'ユーザーID',
    comment             TEXT            NOT NULL        COMMENT '投稿コメント',
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '[TRANSACTIONAL] 投稿コメント'
;
