package database

import (
	"log"

	"github.com/tyronsamaroo/zero-budget-app/internal/models"
)

// SeedTestUser creates a test user if it doesn't exist
func SeedTestUser() {
	var user models.User
	db := GetDB()
	result := db.First(&user, 1)
	if result.Error != nil {
		// Create test user
		testUser := models.User{
			Email: "test@example.com",
			Name:  "Test User",
		}
		if err := db.Create(&testUser).Error; err != nil {
			log.Printf("Error creating test user: %v", err)
			return
		}
		log.Println("Test user created successfully")
	}
}
