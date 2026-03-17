package post

import "time"

type Post struct {
	ID        string
	UserID    string
	ImageURL  string
	Caption   string
	CreatedAt time.Time
	UpdatedAt time.Time
}
