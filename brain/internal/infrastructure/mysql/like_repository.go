package mysql

import (
	"context"
	"database/sql"

	domainlike "github.com/k21hornet/inuminati/internal/domain/like"
)

type likeRepository struct {
	db *sql.DB
}

func NewLikeRepository(db *sql.DB) domainlike.Repository {
	return &likeRepository{db: db}
}

func (r *likeRepository) Save(ctx context.Context, l *domainlike.Like) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)`,
		l.UserID, l.PostID, l.CreatedAt,
	)
	return err
}

func (r *likeRepository) Delete(ctx context.Context, userID, postID string) error {
	_, err := r.db.ExecContext(ctx,
		`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, userID, postID,
	)
	return err
}

func (r *likeRepository) CountByPostID(ctx context.Context, postID string) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM likes WHERE post_id = ?`, postID,
	).Scan(&count)
	return count, err
}

func (r *likeRepository) ExistsByUserIDAndPostID(ctx context.Context, userID, postID string) (bool, error) {
	var exists int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = ?`, userID, postID,
	).Scan(&exists)
	return exists > 0, err
}
