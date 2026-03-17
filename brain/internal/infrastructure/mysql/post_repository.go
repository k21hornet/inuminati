package mysql

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	domainpost "github.com/k21hornet/inuminati/internal/domain/post"
)

type postRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) domainpost.Repository {
	return &postRepository{db: db}
}

func (r *postRepository) FindByID(ctx context.Context, id string) (*domainpost.Post, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, user_id, image_url, caption, created_at, updated_at
		 FROM posts WHERE id = ?`, id)
	return scanPost(row)
}

func (r *postRepository) FindAll(ctx context.Context, limit, offset int) ([]*domainpost.Post, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, user_id, image_url, caption, created_at, updated_at
		 FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanPosts(rows)
}

func (r *postRepository) FindByUserID(ctx context.Context, userID string, limit, offset int) ([]*domainpost.Post, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, user_id, image_url, caption, created_at, updated_at
		 FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanPosts(rows)
}

func (r *postRepository) Save(ctx context.Context, p *domainpost.Post) error {
	p.ID = uuid.New().String()
	now := time.Now()
	p.CreatedAt = now
	p.UpdatedAt = now

	_, err := r.db.ExecContext(ctx,
		`INSERT INTO posts (id, user_id, image_url, caption, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		p.ID, p.UserID, p.ImageURL, p.Caption, p.CreatedAt, p.UpdatedAt,
	)
	return err
}

func (r *postRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM posts WHERE id = ?`, id)
	return err
}

// *sql.RowをPostに変換するヘルパー。見つからない場合は nil, nil を返す。
func scanPost(row *sql.Row) (*domainpost.Post, error) {
	var p domainpost.Post
	err := row.Scan(&p.ID, &p.UserID, &p.ImageURL, &p.Caption, &p.CreatedAt, &p.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func scanPosts(rows *sql.Rows) ([]*domainpost.Post, error) {
	var posts []*domainpost.Post
	for rows.Next() {
		var p domainpost.Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.ImageURL, &p.Caption, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, &p)
	}
	return posts, rows.Err()
}
