package comment

import "context"

type Repository interface {
	Save(ctx context.Context, c *Comment) error
	Delete(ctx context.Context, id string) error
	FindByID(ctx context.Context, id string) (*Comment, error)
	FindByPostID(ctx context.Context, postID string) ([]*Comment, error)
}
