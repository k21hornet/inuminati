package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	followusecase "github.com/k21hornet/inuminati/internal/usecase/follow"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
)

type FollowHandler struct {
	usecase     followusecase.Usecase
	userUsecase userusecase.Usecase
}

func NewFollowHandler(uc followusecase.Usecase, userUC userusecase.Usecase) *FollowHandler {
	return &FollowHandler{usecase: uc, userUsecase: userUC}
}

// フォロワー数・フォロー数・自分がフォロー中かを返す。
// GET /api/v1/users/:id/follow-stats
func (h *FollowHandler) GetStats(c *gin.Context) {
	targetUserID := c.Param("id")

	auth0ID := middleware.GetAuth0ID(c)
	viewerID := ""
	if auth0ID != "" {
		var err error
		viewerID, err = h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
		if err != nil {
			viewerID = ""
		}
	}

	stats, err := h.usecase.GetStats(c.Request.Context(), viewerID, targetUserID)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"followerCount":  stats.FollowerCount,
		"followingCount": stats.FollowingCount,
		"isFollowing":    stats.IsFollowing,
	})
}

// フォローする。
// POST /api/v1/users/:id/follows
func (h *FollowHandler) Follow(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	followerID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	if err := h.usecase.Follow(c.Request.Context(), followerID, c.Param("id")); err != nil {
		respondError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// フォローを解除する。
// DELETE /api/v1/users/:id/follows
func (h *FollowHandler) Unfollow(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	followerID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	if err := h.usecase.Unfollow(c.Request.Context(), followerID, c.Param("id")); err != nil {
		respondError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// フォロワー一覧のユーザーIDリストを返す。
// GET /api/v1/users/:id/followers
func (h *FollowHandler) ListFollowers(c *gin.Context) {
	follows, err := h.usecase.ListFollowers(c.Request.Context(), c.Param("id"))
	if err != nil {
		respondError(c, err)
		return
	}
	ids := make([]string, 0, len(follows))
	for _, f := range follows {
		ids = append(ids, f.FollowerID)
	}
	c.JSON(http.StatusOK, gin.H{"userIds": ids})
}

// フォロー中のユーザーIDリストを返す。
// GET /api/v1/users/:id/following
func (h *FollowHandler) ListFollowing(c *gin.Context) {
	follows, err := h.usecase.ListFollowing(c.Request.Context(), c.Param("id"))
	if err != nil {
		respondError(c, err)
		return
	}
	ids := make([]string, 0, len(follows))
	for _, f := range follows {
		ids = append(ids, f.FolloweeID)
	}
	c.JSON(http.StatusOK, gin.H{"userIds": ids})
}
