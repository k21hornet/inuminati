package follow

import (
	"context"
	"time"

	domainfollow "github.com/k21hornet/inuminati/internal/domain/follow"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
)

// FollowStatsはフォロー統計情報を保持する構造体。
type FollowStats struct {
	FollowerCount int
	FollowingCount int
	IsFollowing   bool
}

// フォローに関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	Follow(ctx context.Context, followerID, followeeID string) error
	Unfollow(ctx context.Context, followerID, followeeID string) error
	GetStats(ctx context.Context, viewerID, targetUserID string) (*FollowStats, error)
	ListFollowers(ctx context.Context, followeeID string) ([]*domainfollow.Follow, error)
	ListFollowing(ctx context.Context, followerID string) ([]*domainfollow.Follow, error)
}

type usecase struct {
	repo domainfollow.Repository
}

func NewUsecase(repo domainfollow.Repository) Usecase {
	return &usecase{repo: repo}
}

func (u *usecase) Follow(ctx context.Context, followerID, followeeID string) error {
	if followerID == followeeID {
		return apperrors.BadRequest("cannot follow yourself")
	}
	exists, err := u.repo.ExistsByIDs(ctx, followerID, followeeID)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if exists {
		return apperrors.New(409, "already following", nil)
	}
	f := &domainfollow.Follow{
		FollowerID: followerID,
		FolloweeID: followeeID,
		CreatedAt:  time.Now(),
	}
	if err := u.repo.Save(ctx, f); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}

func (u *usecase) Unfollow(ctx context.Context, followerID, followeeID string) error {
	exists, err := u.repo.ExistsByIDs(ctx, followerID, followeeID)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if !exists {
		return apperrors.NotFound("follow")
	}
	if err := u.repo.Delete(ctx, followerID, followeeID); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}

func (u *usecase) GetStats(ctx context.Context, viewerID, targetUserID string) (*FollowStats, error) {
	followerCount, err := u.repo.CountFollowers(ctx, targetUserID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	followingCount, err := u.repo.CountFollowing(ctx, targetUserID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	isFollowing := false
	if viewerID != "" && viewerID != targetUserID {
		isFollowing, err = u.repo.ExistsByIDs(ctx, viewerID, targetUserID)
		if err != nil {
			return nil, apperrors.InternalServerError(err)
		}
	}
	return &FollowStats{
		FollowerCount:  followerCount,
		FollowingCount: followingCount,
		IsFollowing:    isFollowing,
	}, nil
}

func (u *usecase) ListFollowers(ctx context.Context, followeeID string) ([]*domainfollow.Follow, error) {
	follows, err := u.repo.FindFollowers(ctx, followeeID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return follows, nil
}

func (u *usecase) ListFollowing(ctx context.Context, followerID string) ([]*domainfollow.Follow, error) {
	follows, err := u.repo.FindFollowing(ctx, followerID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return follows, nil
}
