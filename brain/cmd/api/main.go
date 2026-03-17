package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/k21hornet/inuminati/internal/infrastructure/mysql"
	"github.com/k21hornet/inuminati/internal/infrastructure/storage"
	"github.com/k21hornet/inuminati/internal/interface/handler"
	"github.com/k21hornet/inuminati/internal/interface/router"
	commentusecase "github.com/k21hornet/inuminati/internal/usecase/comment"
	dmusecase "github.com/k21hornet/inuminati/internal/usecase/dm"
	followusecase "github.com/k21hornet/inuminati/internal/usecase/follow"
	likeusecase "github.com/k21hornet/inuminati/internal/usecase/like"
	postusecase "github.com/k21hornet/inuminati/internal/usecase/post"
	userusecase "github.com/k21hornet/inuminati/internal/usecase/user"
	"github.com/k21hornet/inuminati/pkg/logger"
	"go.uber.org/zap"
)

func main() {
	// release以外は.envを自動ロードする
	if os.Getenv("GIN_MODE") != "release" {
		_ = godotenv.Load("./.env")
	}

	logger.Init()
	defer logger.Sync()

	// --- 依存関係の組み立て (Poor man's DI) ---
	// GinにはDIコンテナがないため、main.goで明示的に組み立てる。

	db, err := mysql.NewDB()
	if err != nil {
		logger.L.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer db.Close()

	// マイグレーション（AUTO_MIGRATE=true の時のみ実行）
	if os.Getenv("AUTO_MIGRATE") == "true" {
		if err := mysql.Migrate(db, "./migrations"); err != nil {
			logger.L.Fatal("Failed to run migrations", zap.Error(err))
		}
		logger.L.Info("Migrations applied")
	}

	// infrastructure層
	userRepo := mysql.NewUserRepository(db)
	postRepo := mysql.NewPostRepository(db)
	likeRepo := mysql.NewLikeRepository(db)
	commentRepo := mysql.NewCommentRepository(db)
	followRepo := mysql.NewFollowRepository(db)
	dmRepo := mysql.NewDMRepository(db)
	storageBaseURL := os.Getenv("STORAGE_BASE_URL")
	if storageBaseURL == "" {
		storageBaseURL = "http://localhost:8080/uploads"
	}
	localStorage := storage.NewLocalStorage("./uploads", storageBaseURL)

	// usecase層
	userUsecase := userusecase.NewUsecase(userRepo, localStorage)
	postUsecase := postusecase.NewUsecase(postRepo, localStorage)
	likeUsecase := likeusecase.NewUsecase(likeRepo)
	commentUsecase := commentusecase.NewUsecase(commentRepo)
	followUsecase := followusecase.NewUsecase(followRepo)
	dmUsecase := dmusecase.NewUsecase(dmRepo)

	// interface層
	userHandler := handler.NewUserHandler(userUsecase)
	postHandler := handler.NewPostHandler(postUsecase, userUsecase)
	likeHandler := handler.NewLikeHandler(likeUsecase, userUsecase)
	commentHandler := handler.NewCommentHandler(commentUsecase, userUsecase)
	followHandler := handler.NewFollowHandler(followUsecase, userUsecase)
	dmHandler := handler.NewDMHandler(dmUsecase, userUsecase)

	// ルーター
	r := router.New(userHandler, postHandler, likeHandler, commentHandler, followHandler, dmHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.L.Info("Starting server", zap.String("port", port))
	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		logger.L.Fatal("Failed to start server", zap.Error(err))
	}
}
