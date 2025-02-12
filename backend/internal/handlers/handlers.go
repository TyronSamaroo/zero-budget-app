package handlers

import (
	"gorm.io/gorm"
)

var db *gorm.DB

// Initialize sets up the database connection for all handlers
func Initialize(database *gorm.DB) {
	db = database
}
