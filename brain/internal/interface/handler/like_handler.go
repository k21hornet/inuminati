package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	likeusecase "github.com/k21hornet/inuminati/internal/usecase/like"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
)

type LikeHandler struct {
	usecase     likeusecase.Usecase
	userUsecase userusecase.Usecase
}

func NewLikeHandler(uc likeusecase.Usecase, userUC userusecase.Usecase) *LikeHandler {
	return &LikeHandler{usecase: uc, userUsecase: userUC}
}

// いいね数と自分のいいね状態を返す。
// GET /api/v1/posts/:id/likes
func (h *LikeHandler) GetStatus(c *gin.Context) {
	postID := c.Param("id")

	// 認証は任意: トークンがあればisLikedを返す
	auth0ID := middleware.GetAuth0ID(c)
	userID := ""
	if auth0ID != "" {
		var err error
		userID, err = h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
		if err != nil {
			userID = ""
		}
	}

	status, err := h.usecase.GetStatus(c.Request.Context(), userID, postID)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"count":   status.Count,
		"isLiked": status.IsLiked,
	})
}

// いいねを追加する。
// POST /api/v1/posts/:id/likes
func (h *LikeHandler) Like(c *gin.Context) {
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

	if err := h.usecase.Like(c.Request.Context(), userID, c.Param("id")); err != nil {
		respondError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// いいねを取り消す。
// DELETE /api/v1/posts/:id/likes
func (h *LikeHandler) Unlike(c *gin.Context) {
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

	if err := h.usecase.Unlike(c.Request.Context(), userID, c.Param("id")); err != nil {
		respondError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
