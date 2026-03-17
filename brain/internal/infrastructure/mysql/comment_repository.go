package mysql

import (
	"context"
	"database/sql"
	"errors"

	domaincomment "github.com/k21hornet/inuminati/internal/domain/comment"
)

type commentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) domaincomment.Repository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Save(ctx context.Context, c *domaincomment.Comment) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)`,
		c.ID, c.PostID, c.UserID, c.Content, c.CreatedAt,
	)
	return err
}

func (r *commentRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM comments WHERE id = ?`, id)
	return err
}

func (r *commentRepository) FindByID(ctx context.Context, id string) (*domaincomment.Comment, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT c.id, c.post_id, c.user_id, u.username, c.content, c.created_at
		 FROM comments c
		 JOIN users u ON u.id = c.user_id
		 WHERE c.id = ?`, id)
	var c domaincomment.Comment
	err := row.Scan(&c.ID, &c.PostID, &c.UserID, &c.Username, &c.Content, &c.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *commentRepository) FindByPostID(ctx context.Context, postID string) ([]*domaincomment.Comment, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT c.id, c.post_id, c.user_id, u.username, c.content, c.created_at
		 FROM comments c
		 JOIN users u ON u.id = c.user_id
		 WHERE c.post_id = ?
		 ORDER BY c.created_at ASC`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []*domaincomment.Comment
	for rows.Next() {
		var c domaincomment.Comment
		if err := rows.Scan(&c.ID, &c.PostID, &c.UserID, &c.Username, &c.Content, &c.CreatedAt); err != nil {
			return nil, err
		}
		comments = append(comments, &c)
	}
	return comments, rows.Err()
}
