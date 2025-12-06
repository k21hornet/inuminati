INSERT INTO inuminati_db.users (user_id,user_name, email, self_introduction, birth_date, created_at, updated_at)
VALUES (1, 'test', 'test@example.com', 'hello', '2025-01-01', '2025-01-01', '2025-01-01');

INSERT INTO inuminati_db.posts (post_id, user_id, content, created_at, updated_at)
VALUES (1, 1, 'content', '2025-01-01', '2025-01-01');
