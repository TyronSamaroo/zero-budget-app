package middleware

import (
	"github.com/gin-gonic/gin"
)

// AuthMiddleware handles authentication for protected routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// For now, we'll use a simple user ID for testing
		// Using the same key "user_id" as expected by handlers
		c.Set("user_id", uint(1))
		c.Next()
	}
}
