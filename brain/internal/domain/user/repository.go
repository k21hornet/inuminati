package user

import "context"

type Repository interface {
	FindByID(ctx context.Context, id string) (*User, error)
	FindByAuth0ID(ctx context.Context, auth0ID string) (*User, error)
	Save(ctx context.Context, u *User) error
	Update(ctx context.Context, u *User) error
}
