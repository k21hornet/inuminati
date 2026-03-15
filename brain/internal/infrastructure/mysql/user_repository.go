package mysql

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/k21hornet/inuminati/internal/domain/user"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) user.Repository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, auth0_id, username, bio, avatar_url, created_at, updated_at
		 FROM users WHERE id = ?`, id)
	return scanUser(row)
}

func (r *userRepository) FindByAuth0ID(ctx context.Context, auth0ID string) (*user.User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, auth0_id, username, bio, avatar_url, created_at, updated_at
		 FROM users WHERE auth0_id = ?`, auth0ID)
	return scanUser(row)
}

func (r *userRepository) Save(ctx context.Context, u *user.User) error {
	u.ID = uuid.New().String()
	now := time.Now()
	u.CreatedAt = now
	u.UpdatedAt = now

	_, err := r.db.ExecContext(ctx,
		`INSERT INTO users (id, auth0_id, username, bio, avatar_url, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		u.ID, u.Auth0ID, u.Username, u.Bio, u.AvatarURL, u.CreatedAt, u.UpdatedAt,
	)
	return err
}

func (r *userRepository) Update(ctx context.Context, u *user.User) error {
	u.UpdatedAt = time.Now()
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET username = ?, bio = ?, avatar_url = ?, updated_at = ?
		 WHERE id = ?`,
		u.Username, u.Bio, u.AvatarURL, u.UpdatedAt, u.ID,
	)
	return err
}

// *sql.RowをUserに変換するヘルパー。見つからない場合は nil, nil を返す。
func scanUser(row *sql.Row) (*user.User, error) {
	var u user.User
	err := row.Scan(
		&u.ID, &u.Auth0ID, &u.Username, &u.Bio, &u.AvatarURL,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}
