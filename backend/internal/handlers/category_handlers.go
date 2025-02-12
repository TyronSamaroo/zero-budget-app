package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tyronsamaroo/zero-budget-app/internal/models"
)

// CategoryRequest represents the incoming request for creating/updating a category
type CategoryRequest struct {
	Name       string  `json:"name" binding:"required"`
	Amount     float64 `json:"amount"`
	IsFixed    bool    `json:"isFixed"`
	IsFlexible bool    `json:"isFlexible"`
	MinAmount  float64 `json:"minAmount"`
	MaxAmount  float64 `json:"maxAmount"`
}

// CreateCategory handles the creation of a new category
func CreateCategory(c *gin.Context) {
	var req CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		log.Printf("Received data: %+v", c.Request.Body)
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request data: %v", err)})
		return
	}

	log.Printf("Received category request: %+v", req)

	// Create category from request
	category := models.Category{
		Name:       req.Name,
		Amount:     req.Amount,
		IsFixed:    req.IsFixed,
		IsFlexible: req.IsFlexible,
		MinAmount:  req.MinAmount,
		MaxAmount:  req.MaxAmount,
		Remaining:  req.Amount, // Initialize remaining to full amount
		UserID:     1,          // Default user ID for now
	}

	log.Printf("Creating category: %+v", category)

	if err := db.Create(&category).Error; err != nil {
		log.Printf("Error creating category: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create category: %v", err)})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// GetCategories returns all categories
func GetCategories(c *gin.Context) {
	var categories []models.Category
	if err := db.Find(&categories).Error; err != nil {
		log.Printf("Error getting categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch categories: %v", err)})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// GetCategory returns a specific category
func GetCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// UpdateCategory updates an existing category
func UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&category).Error; err != nil {
		log.Printf("Error updating category: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

// DeleteCategory deletes an existing category
func DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := db.Delete(&category).Error; err != nil {
		log.Printf("Error deleting category: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}

// GetCategorySummary returns a summary of all categories
func GetCategorySummary(c *gin.Context) {
	var categories []models.Category
	if err := db.Find(&categories).Error; err != nil {
		log.Printf("Error getting category summary: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch category summary: %v", err)})
		return
	}

	c.JSON(http.StatusOK, categories)
}
