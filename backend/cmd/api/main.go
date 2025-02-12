package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/tyronsamaroo/zero-budget-app/internal/database"
	"github.com/tyronsamaroo/zero-budget-app/internal/handlers"
	"github.com/tyronsamaroo/zero-budget-app/internal/routes"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	// Initialize database connection
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize handlers with database connection
	handlers.Initialize(db)

	// Run migrations
	log.Println("Running migrations...")
	database.RunMigrations()

	// Seed test user
	database.SeedTestUser()

	// Create a new gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Setup routes
	routes.SetupRoutes(r)

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
