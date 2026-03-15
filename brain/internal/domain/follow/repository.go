package follow

import "context"

type Repository interface {
	Save(ctx context.Context, f *Follow) error
	Delete(ctx context.Context, followerID, followeeID string) error
	ExistsByIDs(ctx context.Context, followerID, followeeID string) (bool, error)
	FindFollowers(ctx context.Context, followeeID string) ([]*Follow, error)
	FindFollowing(ctx context.Context, followerID string) ([]*Follow, error)
	CountFollowers(ctx context.Context, followeeID string) (int, error)
	CountFollowing(ctx context.Context, followerID string) (int, error)
}
