package mysql

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// MySQLへの接続を確立して返す。
// DSN例: "user:password@tcp(localhost:3306)/inuminati?parseTime=true"
func NewDB() (*sql.DB, error) {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		return nil, fmt.Errorf("DB_DSN is not set")
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("sql.Open: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("db.Ping: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)

	return db, nil
}
