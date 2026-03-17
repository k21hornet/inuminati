package post

import (
	"context"
	"mime/multipart"

	domainpost "github.com/k21hornet/inuminati/internal/domain/post"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
)

// 画像の保存先を抽象化するインターフェース。
// usecaseは保存先（ローカル/S3）を知らなくてよくなる。
type ImageStorage interface {
	Save(ctx context.Context, file multipart.File, filename string) (url string, err error)
	Delete(ctx context.Context, url string) error
}

// 投稿に関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	ListFeed(ctx context.Context, limit, offset int) ([]*domainpost.Post, error)
	ListByUserID(ctx context.Context, userID string, limit, offset int) ([]*domainpost.Post, error)
	GetByID(ctx context.Context, id string) (*domainpost.Post, error)
	Create(ctx context.Context, userID string, file multipart.File, filename string, caption string) (*domainpost.Post, error)
	Delete(ctx context.Context, id string, requestUserID string) error
}

type usecase struct {
	repo    domainpost.Repository
	storage ImageStorage
}

func NewUsecase(repo domainpost.Repository, storage ImageStorage) Usecase {
	return &usecase{repo: repo, storage: storage}
}

func (u *usecase) ListFeed(ctx context.Context, limit, offset int) ([]*domainpost.Post, error) {
	posts, err := u.repo.FindAll(ctx, limit, offset)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return posts, nil
}

func (u *usecase) ListByUserID(ctx context.Context, userID string, limit, offset int) ([]*domainpost.Post, error) {
	posts, err := u.repo.FindByUserID(ctx, userID, limit, offset)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return posts, nil
}

func (u *usecase) GetByID(ctx context.Context, id string) (*domainpost.Post, error) {
	post, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	if post == nil {
		return nil, apperrors.NotFound("post")
	}
	return post, nil
}

func (u *usecase) Create(ctx context.Context, userID string, file multipart.File, filename string, caption string) (*domainpost.Post, error) {
	imageURL, err := u.storage.Save(ctx, file, filename)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}

	post := &domainpost.Post{
		UserID:   userID,
		ImageURL: imageURL,
		Caption:  caption,
	}
	if err := u.repo.Save(ctx, post); err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return post, nil
}

func (u *usecase) Delete(ctx context.Context, id string, requestUserID string) error {
	post, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return apperrors.InternalServerError(err)
	}
	if post == nil {
		return apperrors.NotFound("post")
	}
	if post.UserID != requestUserID {
		return apperrors.New(403, "forbidden", nil)
	}

	if err := u.storage.Delete(ctx, post.ImageURL); err != nil {
		return apperrors.InternalServerError(err)
	}
	if err := u.repo.Delete(ctx, id); err != nil {
		return apperrors.InternalServerError(err)
	}
	return nil
}
