package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tyronsamaroo/zero-budget-app/internal/models"
)

// BudgetRequest represents the incoming request for creating/updating a budget
type BudgetRequest struct {
	CategoryID uint    `json:"categoryId"`
	Amount     float64 `json:"amount" binding:"required"`
	IsFixed    bool    `json:"isFixed"`
	IsFlexible bool    `json:"isFlexible"`
	MinAmount  float64 `json:"minAmount"`
	MaxAmount  float64 `json:"maxAmount"`
}

// CreateBudget handles the creation of a new budget
func CreateBudget(c *gin.Context) {
	log.Println("Starting CreateBudget handler")

	var req BudgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		log.Printf("Request body: %+v", c.Request.Body)
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request data: %v", err)})
		return
	}

	log.Printf("Received budget request: %+v", req)

	// Validate category ID
	if req.CategoryID == 0 {
		log.Printf("Invalid category ID: %d", req.CategoryID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category ID is required"})
		return
	}

	// Check if category exists and belongs to user
	// Check if category exists
	var category models.Category
	if err := db.First(&category, req.CategoryID).Error; err != nil {
		log.Printf("Category not found: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found. Please create the category first."})
		return
	}

	// Create budget with fixed user ID
	budget := &models.Budget{
		UserID:     1,
		CategoryID: req.CategoryID,
		Amount:     req.Amount,
		IsFixed:    req.IsFixed,
		IsFlexible: req.IsFlexible,
		MinAmount:  req.MinAmount,
		MaxAmount:  req.MaxAmount,
		Remaining:  req.Amount,
	}

	log.Printf("Creating budget: %+v", budget)

	// Delete any existing budget for this category first
	if err := db.Where("category_id = ?", req.CategoryID).Delete(&models.Budget{}).Error; err != nil {
		log.Printf("Error deleting existing budget: %v", err)
	}

	if err := db.Create(budget).Error; err != nil {
		log.Printf("Error creating budget: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create budget: %v", err)})
		return
	}

	c.JSON(http.StatusCreated, budget)
}

// GetBudget retrieves a specific budget
func GetBudget(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	budgetID := c.Param("id")
	var budget models.Budget

	if err := db.Where("id = ? AND user_id = ?", budgetID, userID).First(&budget).Error; err != nil {
		log.Printf("Error fetching budget: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Budget not found"})
		return
	}

	c.JSON(http.StatusOK, budget)
}

// GetBudgetSummary returns the budget summary
func GetBudgetSummary(c *gin.Context) {
	var budgets []models.Budget
	if err := db.Find(&budgets).Error; err != nil {
		log.Printf("Error fetching budgets for summary: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch budget summary"})
		return
	}

	summary := models.BudgetSummary{}
	for _, budget := range budgets {
		summary.TotalBudgeted += budget.Amount
		summary.TotalSpent += budget.Amount - budget.Remaining
		summary.TotalRemaining += budget.Remaining
		if budget.IsFixed {
			summary.FixedExpenses += budget.Amount
		}
		if budget.IsFlexible {
			summary.FlexibleExpenses += budget.Amount
		}
	}

	c.JSON(http.StatusOK, summary)
}

// GetBudgetCategories returns all budget categories with their current status
func GetBudgetCategories(c *gin.Context) {
	log.Printf("Fetching all categories and budgets")

	var categories []struct {
		ID         uint    `json:"id"`
		Name       string  `json:"name"`
		Budgeted   float64 `json:"budgeted"`
		Spent      float64 `json:"spent"`
		Remaining  float64 `json:"remaining"`
		Progress   float64 `json:"progress"`
		IsFixed    bool    `json:"isFixed"`
		IsFlexible bool    `json:"isFlexible"`
	}

	query := db.Model(&models.Category{}).
		Select(`
			categories.id,
			categories.name,
			COALESCE(budgets.amount, 0) as budgeted,
			COALESCE(budgets.amount - budgets.remaining, 0) as spent,
			COALESCE(budgets.remaining, 0) as remaining,
			CASE 
				WHEN budgets.amount > 0 THEN ((budgets.amount - budgets.remaining) / budgets.amount * 100)
				ELSE 0 
			END as progress,
			COALESCE(budgets.is_fixed, false) as is_fixed,
			COALESCE(budgets.is_flexible, false) as is_flexible
		`).
		Joins("LEFT JOIN budgets ON budgets.category_id = categories.id").
		Where("categories.deleted_at IS NULL")

	if err := query.Scan(&categories).Error; err != nil {
		log.Printf("Error fetching categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch categories: %v", err)})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// UpdateBudget updates an existing budget
func UpdateBudget(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid budget ID"})
		return
	}

	var budget models.Budget
	if err := db.First(&budget, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Budget not found"})
		return
	}

	// Verify ownership
	if budget.UserID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this budget"})
		return
	}

	if err := c.ShouldBindJSON(&budget); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&budget).Error; err != nil {
		log.Printf("Error updating budget: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, budget)
}

// DeleteBudget deletes an existing budget
func DeleteBudget(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid budget ID"})
		return
	}

	var budget models.Budget
	if err := db.First(&budget, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Budget not found"})
		return
	}

	// Verify ownership
	if budget.UserID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this budget"})
		return
	}

	if err := db.Delete(&budget).Error; err != nil {
		log.Printf("Error deleting budget: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Budget deleted successfully"})
}
