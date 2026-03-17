package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	domainpost "github.com/k21hornet/inuminati/internal/domain/post"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	postusecase "github.com/k21hornet/inuminati/internal/usecase/post"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
)

type PostHandler struct {
	usecase     postusecase.Usecase
	userUsecase userusecase.Usecase
}

func NewPostHandler(uc postusecase.Usecase, userUC userusecase.Usecase) *PostHandler {
	return &PostHandler{usecase: uc, userUsecase: userUC}
}

type postResponse struct {
	ID        string `json:"id"`
	UserID    string `json:"userId"`
	ImageURL  string `json:"imageUrl"`
	Caption   string `json:"caption"`
	CreatedAt string `json:"createdAt"`
}

// フィード（全投稿の新着順）を返す。
// GET /api/v1/posts?limit=20&offset=0
func (h *PostHandler) ListFeed(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	posts, err := h.usecase.ListFeed(c.Request.Context(), limit, offset)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toPostResponses(posts))
}

// 特定ユーザーの投稿一覧を返す。
// GET /api/v1/users/:id/posts
func (h *PostHandler) ListByUser(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	posts, err := h.usecase.ListByUserID(c.Request.Context(), c.Param("id"), limit, offset)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toPostResponses(posts))
}

// 投稿詳細を返す。
// GET /api/v1/posts/:id
func (h *PostHandler) GetByID(c *gin.Context) {
	post, err := h.usecase.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toPostResponse(post))
}

// 画像投稿を作成する。
// POST /api/v1/posts  (multipart/form-data: image, caption)
func (h *PostHandler) Create(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Auth0 sub → 内部UUIDに変換
	// JWTのsubはそのままDBのFKには使えないため必ず変換する。
	userID, err := h.userUsecase.GetIDByAuth0ID(c.Request.Context(), auth0ID)
	if err != nil {
		respondError(c, err)
		return
	}

	fh, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image is required"})
		return
	}

	file, err := fh.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open image"})
		return
	}
	defer file.Close()

	post, err := h.usecase.Create(c.Request.Context(), userID, file, fh.Filename, c.PostForm("caption"))
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toPostResponse(post))
}

// 投稿を削除する。
// DELETE /api/v1/posts/:id
func (h *PostHandler) Delete(c *gin.Context) {
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

func toPostResponse(p *domainpost.Post) *postResponse {
	return &postResponse{
		ID:        p.ID,
		UserID:    p.UserID,
		ImageURL:  p.ImageURL,
		Caption:   p.Caption,
		CreatedAt: p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func toPostResponses(posts []*domainpost.Post) []*postResponse {
	res := make([]*postResponse, 0, len(posts))
	for _, p := range posts {
		res = append(res, toPostResponse(p))
	}
	return res
}
