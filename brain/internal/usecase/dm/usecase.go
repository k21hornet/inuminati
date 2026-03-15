package dm

import (
	"context"
	"time"

	domaindm "github.com/k21hornet/inuminati/internal/domain/dm"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
	"github.com/google/uuid"
)

// DMに関するビジネスロジックを定義するインターフェース。
type Usecase interface {
	// ListConversationsは自分が関わる会話一覧（相手ごとの最新メッセージ）を返す。
	ListConversations(ctx context.Context, myUserID string) ([]*domaindm.ConversationSummary, error)
	// GetThreadは特定ユーザーとのメッセージ履歴を返す。
	GetThread(ctx context.Context, myUserID, partnerUserID string, limit, offset int) ([]*domaindm.DirectMessage, error)
	// Sendはメッセージを送信する。
	Send(ctx context.Context, senderID, receiverID, content string) (*domaindm.DirectMessage, error)
}

type usecase struct {
	repo domaindm.Repository
}

func NewUsecase(repo domaindm.Repository) Usecase {
	return &usecase{repo: repo}
}

func (u *usecase) ListConversations(ctx context.Context, myUserID string) ([]*domaindm.ConversationSummary, error) {
	list, err := u.repo.FindConversations(ctx, myUserID)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return list, nil
}

func (u *usecase) GetThread(ctx context.Context, myUserID, partnerUserID string, limit, offset int) ([]*domaindm.DirectMessage, error) {
	msgs, err := u.repo.FindConversation(ctx, myUserID, partnerUserID, limit, offset)
	if err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return msgs, nil
}

func (u *usecase) Send(ctx context.Context, senderID, receiverID, content string) (*domaindm.DirectMessage, error) {
	if content == "" {
		return nil, apperrors.BadRequest("content is required")
	}
	if senderID == receiverID {
		return nil, apperrors.BadRequest("cannot send message to yourself")
	}
	msg := &domaindm.DirectMessage{
		ID:         uuid.New().String(),
		SenderID:   senderID,
		ReceiverID: receiverID,
		Content:    content,
		CreatedAt:  time.Now(),
	}
	if err := u.repo.Save(ctx, msg); err != nil {
		return nil, apperrors.InternalServerError(err)
	}
	return msg, nil
}
