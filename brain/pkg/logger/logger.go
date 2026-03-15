package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// アプリケーション全体で使用するグローバルロガー。
var L *zap.Logger

// GIN_MODE環境変数に応じてロガーを初期化する。
func Init() {
	env := os.Getenv("GIN_MODE")

	var cfg zap.Config
	if env == "release" {
		cfg = zap.NewProductionConfig()
	} else {
		cfg = zap.NewDevelopmentConfig()
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	var err error
	L, err = cfg.Build()
	if err != nil {
		panic(err)
	}
}

// バッファされたログエントリをフラッシュする。
func Sync() {
	if L != nil {
		_ = L.Sync()
	}
}
