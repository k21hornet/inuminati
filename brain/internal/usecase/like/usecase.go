package like

import (
	"context"
	"time"

	domainlike "github.com/k21hornet/inuminati/internal/domain/like"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
)

// いいねの状態を保持する構造体。
type LikeStatus struct {
	Count   int
	IsLiked bool
}

// いいねに関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	Like(ctx context.Context, userID, postID string) error
	Unlike(ctx context.Context, userID, postID string) error
	GetStatus(ctx context.Context, userID, postID string) (*LikeStatus, error)
}

type usecase struct {
	repo domainlike.Repository
}

func NewUsecase(repo domainlike.Repository) Usecase {
	return &usecase{repo: repo}
}

func (u *usecase) Like(ctx context.Context, userID, postID string) error {
	exists, err := u.repo.ExistsByUserIDAndPostID(ctx, userID, postID)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if exists {
		return apperrors.New(409, "already liked", nil)
	}
	l := &domainlike.Like{
		UserID:    userID,
		PostID:    postID,
		CreatedAt: time.Now(),
	}
	if err := u.repo.Save(ctx, l); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}

func (u *usecase) Unlike(ctx context.Context, userID, postID string) error {
	exists, err := u.repo.ExistsByUserIDAndPostID(ctx, userID, postID)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if !exists {
		return apperrors.NotFound("like")
	}
	if err := u.repo.Delete(ctx, userID, postID); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}

func (u *usecase) GetStatus(ctx context.Context, userID, postID string) (*LikeStatus, error) {
	count, err := u.repo.CountByPostID(ctx, postID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	isLiked := false
	if userID != "" {
		isLiked, err = u.repo.ExistsByUserIDAndPostID(ctx, userID, postID)
		if err != nil {
			return nil, apperrors.InternalServerError(err)
		}
	}
	return &LikeStatus{Count: count, IsLiked: isLiked}, nil
}
