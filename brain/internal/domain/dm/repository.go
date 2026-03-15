package dm

import "context"

type Repository interface {
	Save(ctx context.Context, msg *DirectMessage) error
	FindConversation(ctx context.Context, userID1, userID2 string, limit, offset int) ([]*DirectMessage, error)
	FindConversations(ctx context.Context, myUserID string) ([]*ConversationSummary, error)
}
