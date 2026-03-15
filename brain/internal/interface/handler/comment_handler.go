package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	domaincomment "github.com/k21hornet/inuminati/internal/domain/comment"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	commentusecase "github.com/k21hornet/inuminati/internal/usecase/comment"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
)

type CommentHandler struct {
	usecase     commentusecase.Usecase
	userUsecase userusecase.Usecase
}

func NewCommentHandler(uc commentusecase.Usecase, userUC userusecase.Usecase) *CommentHandler {
	return &CommentHandler{usecase: uc, userUsecase: userUC}
}

type commentResponse struct {
	ID        string `json:"id"`
	PostID    string `json:"postId"`
	UserID    string `json:"userId"`
	Username  string `json:"username"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
}

// GET /api/v1/posts/:id/comments
func (h *CommentHandler) ListByPost(c *gin.Context) {
	comments, err := h.usecase.ListByPostID(c.Request.Context(), c.Param("id"))
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toCommentResponses(comments))
}

// POST /api/v1/posts/:id/comments
func (h *CommentHandler) Create(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
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

	comment, err := h.usecase.Create(c.Request.Context(), c.Param("id"), userID, req.Content)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toCommentResponse(comment))
}

// DELETE /api/v1/comments/:id
func (h *CommentHandler) Delete(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	if err := h.usecase.Delete(c.Request.Context(), c.Param("id"), userID); err != nil {
		respondError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func toCommentResponse(c *domaincomment.Comment) *commentResponse {
	return &commentResponse{
		ID:        c.ID,
		PostID:    c.PostID,
		UserID:    c.UserID,
		Username:  c.Username,
		Content:   c.Content,
		CreatedAt: c.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func toCommentResponses(comments []*domaincomment.Comment) []*commentResponse {
	res := make([]*commentResponse, 0, len(comments))
	for _, c := range comments {
		res = append(res, toCommentResponse(c))
	}
	return res
}
