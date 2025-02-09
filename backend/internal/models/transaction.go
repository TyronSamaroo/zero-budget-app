package models

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	UserID      uint      `gorm:"not null"`
	CategoryID  uint      `gorm:"not null"`
	Amount      float64   `gorm:"not null"`
	Date        time.Time `gorm:"not null"`
	Description string    `gorm:"not null"`
	Type        string    `gorm:"not null"` // "income" or "expense"
	Payee       string
	Note        string
	IsRecurring bool `gorm:"default:false"`
}
