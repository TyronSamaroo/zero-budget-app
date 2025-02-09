package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name         string        `gorm:"not null"`
	UserID       uint          `gorm:"not null"`
	Color        string        // Hex color code
	Icon         string        // Icon identifier
	Budgets      []Budget      `gorm:"foreignKey:CategoryID"`
	Transactions []Transaction `gorm:"foreignKey:CategoryID"`
}
