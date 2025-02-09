package models

import (
	"time"

	"gorm.io/gorm"
)

type Budget struct {
	gorm.Model
	UserID     uint      `gorm:"not null"`
	CategoryID uint      `gorm:"not null"`
	Amount     float64   `gorm:"not null"`
	Month      time.Time `gorm:"not null"` // First day of the month
	Spent      float64   `gorm:"default:0"`
	Remaining  float64   `gorm:"default:0"`
}
