package comment

import (
	"context"
	"time"

	domaincomment "github.com/k21hornet/inuminati/internal/domain/comment"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
	"github.com/google/uuid"
)

// コメントに関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	ListByPostID(ctx context.Context, postID string) ([]*domaincomment.Comment, error)
	Create(ctx context.Context, postID, userID, content string) (*domaincomment.Comment, error)
	Delete(ctx context.Context, id, requestUserID string) error
}

type usecase struct {
	repo domaincomment.Repository
}

func NewUsecase(repo domaincomment.Repository) Usecase {
	return &usecase{repo: repo}
}

func (u *usecase) ListByPostID(ctx context.Context, postID string) ([]*domaincomment.Comment, error) {
	comments, err := u.repo.FindByPostID(ctx, postID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return comments, nil
}

func (u *usecase) Create(ctx context.Context, postID, userID, content string) (*domaincomment.Comment, error) {
	if content == "" {
		return nil, apperrors.BadRequest("content is required")
	}
	c := &domaincomment.Comment{
		ID:        uuid.New().String(),
		PostID:    postID,
		UserID:    userID,
		Content:   content,
		CreatedAt: time.Now(),
	}
	if err := u.repo.Save(ctx, c); err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return c, nil
}

func (u *usecase) Delete(ctx context.Context, id, requestUserID string) error {
	c, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if c == nil {
		return apperrors.NotFound("comment")
	}
	if c.UserID != requestUserID {
		return apperrors.New(403, "forbidden", nil)
	}
	if err := u.repo.Delete(ctx, id); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}
