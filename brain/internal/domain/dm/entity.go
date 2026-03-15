package dm

import "time"

type DirectMessage struct {
	ID         string
	SenderID   string
	ReceiverID string
	Content    string
	CreatedAt  time.Time
}

type ConversationSummary struct {
	PartnerID          string
	PartnerUsername    string
	PartnerAvatarURL   string
	LastContent        string
	LastMessageAt      time.Time
}
