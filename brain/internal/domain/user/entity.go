package user

import "time"

type User struct {
	ID        string
	Auth0ID   string // Auth0のsubクレーム (例: "auth0|abc123")
	Username  string
	Bio       string
	AvatarURL string
	CreatedAt time.Time
	UpdatedAt time.Time
}
