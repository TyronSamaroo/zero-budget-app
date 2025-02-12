package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/tyronsamaroo/zero-budget-app/internal/models"
)

var db *gorm.DB

// Connect initializes and returns the database connection
func Connect() (*gorm.DB, error) {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	// Get database connection details from environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Create connection string
	dsn := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, dbname)
	log.Printf("Connecting to database: %s", dsn)

	// Open database connection
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	log.Println("Database connection established")
	return db, nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return db
}

// InitDB initializes the database connection
func InitDB() {
	// Get database connection details from environment variables
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		user = os.Getenv("USER")
	}

	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "zero_budget_db"
	}

	// Create connection string with password if it exists
	var dsn string
	if password != "" {
		dsn = fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable",
			user, password, host, port, dbname)
	} else {
		dsn = fmt.Sprintf("postgresql://%s@%s:%s/%s?sslmode=disable",
			user, host, port, dbname)
	}

	log.Printf("Connecting to database: postgresql://%s@%s:%s/%s", user, host, port, dbname)

	// Open database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db = db
	log.Println("Database connection established")

	// Run migrations
	log.Println("Running migrations...")

	// Drop existing tables if they exist
	log.Println("Dropping existing tables...")
	db.Exec("DROP TABLE IF EXISTS budgets CASCADE")
	db.Exec("DROP TABLE IF EXISTS categories CASCADE")
	db.Exec("DROP TABLE IF EXISTS users CASCADE")

	// Create tables
	log.Println("Creating tables...")
	if err := db.AutoMigrate(&models.User{}, &models.Category{}, &models.Budget{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Migrations completed successfully")
}

// RunMigrations runs all database migrations
func RunMigrations() {
	db := GetDB()
	if db == nil {
		log.Fatal("Database connection not initialized")
	}

	log.Println("Running migrations...")

	// Drop existing tables if they exist
	log.Println("Dropping existing tables...")
	db.Exec("DROP TABLE IF EXISTS budgets CASCADE")
	db.Exec("DROP TABLE IF EXISTS categories CASCADE")
	db.Exec("DROP TABLE IF EXISTS users CASCADE")

	// Create tables
	log.Println("Creating tables...")
	if err := db.AutoMigrate(&models.User{}, &models.Category{}, &models.Budget{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Migrations completed successfully")
}
