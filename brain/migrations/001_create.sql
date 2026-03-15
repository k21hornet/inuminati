CREATE TABLE IF NOT EXISTS users (
    id          VARCHAR(36)  NOT NULL,
    auth0_id    VARCHAR(128) NOT NULL,
    username    VARCHAR(50)  NOT NULL,
    bio         VARCHAR(500) NOT NULL DEFAULT '',
    avatar_url  VARCHAR(512) NOT NULL DEFAULT '',
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_auth0_id (auth0_id),
    UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS posts (
    id          VARCHAR(36)  NOT NULL,
    user_id     VARCHAR(36)  NOT NULL,
    image_url   VARCHAR(512) NOT NULL,
    caption     VARCHAR(2200) NOT NULL DEFAULT '',
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME     NOT NULL,
    PRIMARY KEY (id),
    KEY idx_user_id (user_id),
    KEY idx_created_at (created_at),
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS likes (
    user_id    VARCHAR(36) NOT NULL,
    post_id    VARCHAR(36) NOT NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
    id         VARCHAR(36)  NOT NULL,
    post_id    VARCHAR(36)  NOT NULL,
    user_id    VARCHAR(36)  NOT NULL,
    content    TEXT         NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS follows (
    follower_id VARCHAR(36) NOT NULL,
    followee_id VARCHAR(36) NOT NULL,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS direct_messages (
    id          VARCHAR(36)  NOT NULL,
    sender_id   VARCHAR(36)  NOT NULL,
    receiver_id VARCHAR(36)  NOT NULL,
    content     TEXT         NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (sender_id, receiver_id, created_at),
    INDEX idx_receiver     (receiver_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
