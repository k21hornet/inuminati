package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k21hornet/inuminati/internal/interface/handler"
	"github.com/k21hornet/inuminati/internal/interface/middleware"
)

// Ginエンジンを構築して返す。
// ハンドラは外から受け取り、routerはルーティングのみを担当する。
func New(
	userHandler *handler.UserHandler,
	postHandler *handler.PostHandler,
	likeHandler *handler.LikeHandler,
	commentHandler *handler.CommentHandler,
	followHandler *handler.FollowHandler,
	dmHandler *handler.DMHandler,
) *gin.Engine {
	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(gin.Logger())
	r.Use(middleware.CORS())

	// 静的ファイル配信 (ローカル開発時の画像表示用)
	r.Static("/uploads", "./uploads")

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")

	// 認証なし
	v1.GET("/posts", postHandler.ListFeed)
	v1.GET("/posts/:id", postHandler.GetByID)
	v1.GET("/posts/:id/comments", commentHandler.ListByPost)
	v1.GET("/users/:id", userHandler.GetByID)
	v1.GET("/users/:id/posts", postHandler.ListByUser)
	v1.GET("/users/:id/followers", followHandler.ListFollowers)
	v1.GET("/users/:id/following", followHandler.ListFollowing)

	// 任意認証: 未ログインでも取得可能だが、ログイン中はisLiked / isFollowingを返す
	optAuth := v1.Group("", middleware.OptionalAuth())
	optAuth.GET("/posts/:id/likes", likeHandler.GetStatus)
	optAuth.GET("/users/:id/follow-stats", followHandler.GetStats)

	// 認証が必要なルートグループ
	authed := v1.Group("")
	authed.Use(middleware.Auth())
	{
		authed.GET("/users/me", userHandler.Me)
		authed.PUT("/users/:id", userHandler.UpdateProfile)

		authed.POST("/posts", postHandler.Create)
		authed.DELETE("/posts/:id", postHandler.Delete)

		// いいね
		authed.POST("/posts/:id/likes", likeHandler.Like)
		authed.DELETE("/posts/:id/likes", likeHandler.Unlike)

		// コメント
		authed.POST("/posts/:id/comments", commentHandler.Create)
		authed.DELETE("/comments/:id", commentHandler.Delete)

		// フォロー
		authed.POST("/users/:id/follows", followHandler.Follow)
		authed.DELETE("/users/:id/follows", followHandler.Unfollow)

		// DM
		authed.GET("/messages", dmHandler.ListConversations)
		authed.GET("/messages/:userId", dmHandler.GetThread)
		authed.POST("/messages/:userId", dmHandler.Send)
	}

	return r
}
