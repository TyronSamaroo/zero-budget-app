package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tyronsamaroo/zero-budget-app/internal/handlers"
)

func SetupRoutes(r *gin.Engine) {
	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		// Categories
		api.POST("/categories", handlers.CreateCategory)
		api.GET("/categories", handlers.GetCategories)
		api.GET("/categories/summary", handlers.GetCategorySummary)
		api.PUT("/categories/:id", handlers.UpdateCategory)
		api.DELETE("/categories/:id", handlers.DeleteCategory)

		// Budgets
		api.POST("/budgets", handlers.CreateBudget)
		api.GET("/budgets", handlers.GetBudgetSummary)
		api.GET("/budgets/categories", handlers.GetBudgetCategories)
		api.GET("/budgets/:id", handlers.GetBudget)
		api.PUT("/budgets/:id", handlers.UpdateBudget)
		api.DELETE("/budgets/:id", handlers.DeleteBudget)
	}
}
