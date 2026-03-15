package middleware

import (
	"context"
	"net/http"
	"net/url"
	"os"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
)

// コンテキストキーの型。
// 文字列キーによる衝突を防ぐために専用型を使う。
type contextKey string

const ClaimsKey contextKey = "claims"

// JWTの追加クレーム。
type CustomClaims struct {
	Sub string `json:"sub"` // Auth0 ユーザーID
}

func (c CustomClaims) Validate(_ context.Context) error { return nil }

// AuthはAuth0 JWTを検証するミドルウェア。
func Auth() gin.HandlerFunc {
	domain := os.Getenv("AUTH0_DOMAIN")
	audience := os.Getenv("AUTH0_AUDIENCE")

	issuerURL, _ := url.Parse("https://" + domain + "/")

	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, _ := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(func() validator.CustomClaims {
			return &CustomClaims{}
		}),
	)

	middleware := jwtmiddleware.New(jwtValidator.ValidateToken)

	return func(c *gin.Context) {
		var claims *validator.ValidatedClaims

		// go-jwt-middlewareはhttp.HandlerベースなのでGinと橋渡しする。
		encounteredError := true
		var handler http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {
			encounteredError = false
			claims = r.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
			c.Request = r
		}

		middleware.CheckJWT(handler).ServeHTTP(c.Writer, c.Request)

		if encounteredError {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		c.Set(string(ClaimsKey), claims)
		c.Next()
	}
}

// トークンがあれば検証してクレームをセットし、なければそのまま通すミドルウェア。
// いいね数取得・フォロー統計など「未ログインでも見られるが、ログイン中はisLiked / isFollowingを返す」
// エンドポイントに使う。
func OptionalAuth() gin.HandlerFunc {
	domain := os.Getenv("AUTH0_DOMAIN")
	audience := os.Getenv("AUTH0_AUDIENCE")

	issuerURL, _ := url.Parse("https://" + domain + "/")
	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, _ := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(func() validator.CustomClaims {
			return &CustomClaims{}
		}),
	)

	mw := jwtmiddleware.New(jwtValidator.ValidateToken)

	return func(c *gin.Context) {
		// Authorizationヘッダーがなければスキップ
		if c.GetHeader("Authorization") == "" {
			c.Next()
			return
		}

		var claims *validator.ValidatedClaims
		validated := false
		var handler http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {
			v := r.Context().Value(jwtmiddleware.ContextKey{})
			if v != nil {
				if vc, ok := v.(*validator.ValidatedClaims); ok {
					claims = vc
					validated = true
				}
			}
			c.Request = r
		}
		mw.CheckJWT(handler).ServeHTTP(c.Writer, c.Request)

		if validated {
			c.Set(string(ClaimsKey), claims)
		}
		c.Next()
	}
}

// コンテキストからAuth0ユーザーID (sub) を取得する。
func GetAuth0ID(c *gin.Context) string {
	v, exists := c.Get(string(ClaimsKey))
	if !exists {
		return ""
	}
	claims, ok := v.(*validator.ValidatedClaims)
	if !ok {
		return ""
	}
	custom, ok := claims.CustomClaims.(*CustomClaims)
	if !ok {
		return ""
	}
	return custom.Sub
}
