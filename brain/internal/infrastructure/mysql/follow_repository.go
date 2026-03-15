package mysql

import (
	"context"
	"database/sql"

	domainfollow "github.com/k21hornet/inuminati/internal/domain/follow"
)

type followRepository struct {
	db *sql.DB
}

func NewFollowRepository(db *sql.DB) domainfollow.Repository {
	return &followRepository{db: db}
}

func (r *followRepository) Save(ctx context.Context, f *domainfollow.Follow) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO follows (follower_id, followee_id, created_at) VALUES (?, ?, ?)`,
		f.FollowerID, f.FolloweeID, f.CreatedAt,
	)
	return err
}

func (r *followRepository) Delete(ctx context.Context, followerID, followeeID string) error {
	_, err := r.db.ExecContext(ctx,
		`DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`, followerID, followeeID,
	)
	return err
}

func (r *followRepository) ExistsByIDs(ctx context.Context, followerID, followeeID string) (bool, error) {
	var count int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM follows WHERE follower_id = ? AND followee_id = ?`, followerID, followeeID,
	).Scan(&count)
	return count > 0, err
}

func (r *followRepository) FindFollowers(ctx context.Context, followeeID string) ([]*domainfollow.Follow, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT follower_id, followee_id, created_at FROM follows WHERE followee_id = ? ORDER BY created_at DESC`,
		followeeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanFollows(rows)
}

func (r *followRepository) FindFollowing(ctx context.Context, followerID string) ([]*domainfollow.Follow, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT follower_id, followee_id, created_at FROM follows WHERE follower_id = ? ORDER BY created_at DESC`,
		followerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanFollows(rows)
}

func (r *followRepository) CountFollowers(ctx context.Context, followeeID string) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM follows WHERE followee_id = ?`, followeeID,
	).Scan(&count)
	return count, err
}

func (r *followRepository) CountFollowing(ctx context.Context, followerID string) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM follows WHERE follower_id = ?`, followerID,
	).Scan(&count)
	return count, err
}

// scanFollowsは *sql.RowsをFollowスライスに変換するヘルパー。
func scanFollows(rows *sql.Rows) ([]*domainfollow.Follow, error) {
	var follows []*domainfollow.Follow
	for rows.Next() {
		var f domainfollow.Follow
		if err := rows.Scan(&f.FollowerID, &f.FolloweeID, &f.CreatedAt); err != nil {
			return nil, err
		}
		follows = append(follows, &f)
	}
	return follows, rows.Err()
}
