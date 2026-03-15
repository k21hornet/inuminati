package user

import (
	"context"
	"mime/multipart"

	"github.com/k21hornet/inuminati/internal/domain/user"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
)

// 画像の保存先を抽象化するインターフェース。
type ImageStorage interface {
	Save(ctx context.Context, file multipart.File, filename string) (url string, err error)
	Delete(ctx context.Context, url string) error
}

// ユーザーに関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	GetByID(ctx context.Context, id string) (*user.User, error)
	GetOrCreateByAuth0ID(ctx context.Context, auth0ID string, username string) (*user.User, error)
	// GetIDByAuth0IDはAuth0 subから内部UUIDを返す。
	// 投稿作成など、JWTから内部IDに変換する必要がある場面で使う。
	GetIDByAuth0ID(ctx context.Context, auth0ID string) (string, error)
	UpdateProfile(ctx context.Context, id string, input UpdateProfileInput) (*user.User, error)
}

type UpdateProfileInput struct {
	Username        string
	Bio             string
	AvatarFile      multipart.File // nilの場合は既存アバターを維持
	AvatarFilename  string
}

type usecase struct {
	repo    user.Repository
	storage ImageStorage
}

func NewUsecase(repo user.Repository, storage ImageStorage) Usecase {
	return &usecase{repo: repo, storage: storage}
}

func (u *usecase) GetByID(ctx context.Context, id string) (*user.User, error) {
	found, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	if found == nil {
		return nil, apperrors.NotFound("user")
	}
	return found, nil
}

// GetOrCreateByAuth0IDはログイン時に呼ばれ、初回なら自動でユーザーを作成する。
func (u *usecase) GetOrCreateByAuth0ID(ctx context.Context, auth0ID string, username string) (*user.User, error) {
	found, err := u.repo.FindByAuth0ID(ctx, auth0ID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	if found != nil {
		return found, nil
	}

	newUser := &user.User{
		Auth0ID:  auth0ID,
		Username: username,
	}
	if err := u.repo.Save(ctx, newUser); err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return newUser, nil
}

func (u *usecase) GetIDByAuth0ID(ctx context.Context, auth0ID string) (string, error) {
	found, err := u.repo.FindByAuth0ID(ctx, auth0ID)
	if err != nil {
		return "", apperrors.InternalServerError(err)
	}
	if found == nil {
		return "", apperrors.NotFound("user")
	}
	return found.ID, nil
}

func (u *usecase) UpdateProfile(ctx context.Context, id string, input UpdateProfileInput) (*user.User, error) {
	found, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	if found == nil {
		return nil, apperrors.NotFound("user")
	}

	found.Username = input.Username
	found.Bio = input.Bio
	if input.AvatarFile != nil {
		avatarURL, err := u.storage.Save(ctx, input.AvatarFile, input.AvatarFilename)
		if err != nil {
			return nil, apperrors.InternalServerError(err)
		}
		found.AvatarURL = avatarURL
	}

	if err := u.repo.Update(ctx, found); err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return found, nil
}
