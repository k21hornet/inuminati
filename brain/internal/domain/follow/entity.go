package follow

import "time"

type Follow struct {
	FollowerID string
	FolloweeID string
	CreatedAt  time.Time
}
