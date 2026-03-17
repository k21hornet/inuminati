package like

import "context"

type Repository interface {
	Save(ctx context.Context, l *Like) error
	Delete(ctx context.Context, userID, postID string) error
	CountByPostID(ctx context.Context, postID string) (int, error)
	ExistsByUserIDAndPostID(ctx context.Context, userID, postID string) (bool, error)
}
