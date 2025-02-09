package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null"`
	Password     string `gorm:"not null"`
	FirstName    string
	LastName     string
	Categories   []Category    `gorm:"foreignKey:UserID"`
	Budgets      []Budget      `gorm:"foreignKey:UserID"`
	Transactions []Transaction `gorm:"foreignKey:UserID"`
}
