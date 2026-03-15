package post

import "context"

type Repository interface {
	FindByID(ctx context.Context, id string) (*Post, error)
	FindAll(ctx context.Context, limit, offset int) ([]*Post, error)
	FindByUserID(ctx context.Context, userID string, limit, offset int) ([]*Post, error)
	Save(ctx context.Context, p *Post) error
	Delete(ctx context.Context, id string) error
}
