package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	domaindm "github.com/k21hornet/inuminati/internal/domain/dm"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	dmusecase "github.com/k21hornet/inuminati/internal/usecase/dm"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
)

type DMHandler struct {
	usecase     dmusecase.Usecase
	userUsecase userusecase.Usecase
}

func NewDMHandler(uc dmusecase.Usecase, userUC userusecase.Usecase) *DMHandler {
	return &DMHandler{usecase: uc, userUsecase: userUC}
}

type conversationResponse struct {
	PartnerID          string `json:"partnerId"`
	PartnerUsername    string `json:"partnerUsername"`
	PartnerAvatarURL   string `json:"partnerAvatarUrl"`
	LastContent        string `json:"lastContent"`
	LastMessageAt      string `json:"lastMessageAt"`
}

type messageResponse struct {
	ID         string `json:"id"`
	SenderID   string `json:"senderId"`
	ReceiverID string `json:"receiverId"`
	Content    string `json:"content"`
	CreatedAt  string `json:"createdAt"`
}

// 自分の会話一覧（相手ごとの最新メッセージ）を返す。
// GET /api/v1/messages
func (h *DMHandler) ListConversations(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	myUserID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	list, err := h.usecase.ListConversations(c.Request.Context(), myUserID)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toConversationResponses(list))
}

// 特定ユーザーとのメッセージ履歴を返す。
// GET /api/v1/messages/:userId?limit=50&offset=0
func (h *DMHandler) GetThread(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	myUserID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	msgs, err := h.usecase.GetThread(c.Request.Context(), myUserID, c.Param("userId"), limit, offset)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toMessageResponses(msgs))
}

// メッセージを送信する。
// POST /api/v1/messages/:userId  { "content": "..." }
func (h *DMHandler) Send(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	senderID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	var req struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg, err := h.usecase.Send(c.Request.Context(), senderID, c.Param("userId"), req.Content)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toMessageResponse(msg))
}

func toConversationResponse(s *domaindm.ConversationSummary) *conversationResponse {
	return &conversationResponse{
		PartnerID:        s.PartnerID,
		PartnerUsername:  s.PartnerUsername,
		PartnerAvatarURL: s.PartnerAvatarURL,
		LastContent:      s.LastContent,
		LastMessageAt:    s.LastMessageAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func toConversationResponses(list []*domaindm.ConversationSummary) []*conversationResponse {
	res := make([]*conversationResponse, 0, len(list))
	for _, s := range list {
		res = append(res, toConversationResponse(s))
	}
	return res
}

func toMessageResponse(m *domaindm.DirectMessage) *messageResponse {
	return &messageResponse{
		ID:         m.ID,
		SenderID:   m.SenderID,
		ReceiverID: m.ReceiverID,
		Content:    m.Content,
		CreatedAt:  m.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func toMessageResponses(msgs []*domaindm.DirectMessage) []*messageResponse {
	res := make([]*messageResponse, 0, len(msgs))
	for _, m := range msgs {
		res = append(res, toMessageResponse(m))
	}
	return res
}
