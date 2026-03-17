package storage

import (
	"context"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// 開発用のローカルファイル保存。
// usecaseのImageStorage interfaceを実装する。
// 本番ではS3Storageなど別実装に差し替える。
type LocalStorage struct {
	baseDir string // 保存ディレクトリ (例: "./uploads")
	baseURL string // 公開URLのベース (例: "http://localhost:8080/uploads")
}

func NewLocalStorage(baseDir, baseURL string) *LocalStorage {
	_ = os.MkdirAll(baseDir, 0755)
	return &LocalStorage{baseDir: baseDir, baseURL: baseURL}
}

func (s *LocalStorage) Save(_ context.Context, file multipart.File, filename string) (string, error) {
	ext := filepath.Ext(filename)

	// Server Action 経由でファイル名が失われた場合、中身からMIMEタイプを検出して拡張子を補完する
	if ext == "" {
		buf := make([]byte, 512)
		n, err := file.Read(buf)
		if err != nil && err != io.EOF {
			return "", fmt.Errorf("read file for detection: %w", err)
		}
		mimeType := http.DetectContentType(buf[:n])
		if exts, _ := mime.ExtensionsByType(mimeType); len(exts) > 0 {
			ext = exts[len(exts)-1]
		}
		// ファイルポインタを先頭に戻す
		if _, err := file.Seek(0, io.SeekStart); err != nil {
			return "", fmt.Errorf("seek file: %w", err)
		}
	}

	newName := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	dst := filepath.Join(s.baseDir, newName)

	out, err := os.Create(dst)
	if err != nil {
		return "", fmt.Errorf("create file: %w", err)
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		return "", fmt.Errorf("copy file: %w", err)
	}

	return s.baseURL + "/" + newName, nil
}

func (s *LocalStorage) Delete(_ context.Context, url string) error {
	// URLからファイル名を取り出してローカルファイルを削除
	name := url[strings.LastIndex(url, "/")+1:]
	path := filepath.Join(s.baseDir, name)
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("remove file: %w", err)
	}
	return nil
}
