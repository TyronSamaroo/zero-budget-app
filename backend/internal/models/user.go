package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email      string     `json:"email" gorm:"uniqueIndex;not null"`
	Password   string     `json:"password"` // Made optional for testing
	Name       string     `json:"name"`
	Categories []Category `json:"categories,omitempty" gorm:"foreignKey:UserID"`
	Budgets    []Budget   `json:"budgets,omitempty" gorm:"foreignKey:UserID"`
}
