package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	domainuser "github.com/k21hornet/inuminati/internal/domain/user"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
	apperrors "github.com/k21hornet/inuminati/pkg/errors"
)

// ユーザー関連のHTTPハンドラ。
type UserHandler struct {
	usecase userusecase.Usecase
}

func NewUserHandler(uc userusecase.Usecase) *UserHandler {
	return &UserHandler{usecase: uc}
}

type userResponse struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	AvatarURL string `json:"avatarUrl"`
}

// 自分のプロフィールを取得する（初回ログイン時は自動作成）。
// GET /api/v1/users/me
func (h *UserHandler) Me(c *gin.Context) {
	auth0ID := middleware.GetAuth0ID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	u, err := h.usecase.GetOrCreateByAuth0ID(c.Request.Context(), auth0ID, "")
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toUserResponse(u))
}

// 指定IDのユーザープロフィールを取得する。
// GET /api/v1/users/:id
func (h *UserHandler) GetByID(c *gin.Context) {
	u, err := h.usecase.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toUserResponse(u))
}

// 自分のプロフィールを更新する。
// PUT /api/v1/users/:id  (multipart/form-data: username, bio, avatar(optional))
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	username := c.PostForm("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username is required"})
		return
	}

	input := userusecase.UpdateProfileInput{
		Username: username,
		Bio:      c.PostForm("bio"),
	}

	// アバター画像は任意
	fh, err := c.FormFile("avatar")
	if err == nil {
		file, err := fh.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open avatar"})
			return
		}
		defer file.Close()
		input.AvatarFile = file
		input.AvatarFilename = fh.Filename
	}

	u, err := h.usecase.UpdateProfile(c.Request.Context(), c.Param("id"), input)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, toUserResponse(u))
}

func toUserResponse(u *domainuser.User) *userResponse {
	return &userResponse{
		ID:        u.ID,
		Username:  u.Username,
		Bio:       u.Bio,
		AvatarURL: u.AvatarURL,
	}
}

// エラーをHTTPレスポンスに変換する。
func respondError(c *gin.Context, err error) {
	var appErr *apperrors.AppError
	if apperrors.As(err, &appErr) {
		c.JSON(appErr.Code, gin.H{"error": appErr.Message})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
}
