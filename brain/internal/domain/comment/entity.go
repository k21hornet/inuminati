package comment

import "time"

type Comment struct {
	ID        string
	PostID    string
	UserID    string
	Username  string // JOINで取得 (表示用)
	Content   string
	CreatedAt time.Time
}
