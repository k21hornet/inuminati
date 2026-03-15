package errors

import (
	"errors"
	"net/http"
)

// アプリケーション固有のエラー型。
type AppError struct {
	Code    int    // HTTPステータスコード
	Message string // クライアントに返すメッセージ
	Err     error  // 元のエラー (ログ用)
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// Newは汎用エラーを生成する。
func New(code int, message string, err error) *AppError {
	return &AppError{Code: code, Message: message, Err: err}
}

// NotFoundは404エラーを生成する。
func NotFound(resource string) *AppError {
	return New(http.StatusNotFound, resource+" not found", nil)
}

// BadRequestは400エラーを生成する。
func BadRequest(message string) *AppError {
	return New(http.StatusBadRequest, message, nil)
}

// Unauthorizedは401エラーを生成する。
func Unauthorized() *AppError {
	return New(http.StatusUnauthorized, "unauthorized", nil)
}

// InternalServerErrorは500エラーを生成する。
func InternalServerError(err error) *AppError {
	return New(http.StatusInternalServerError, "internal server error", err)
}

// Asはerrors.Asのショートカット。
func As(err error, target any) bool {
	return errors.As(err, target)
}
