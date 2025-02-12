package models

import (
	"gorm.io/gorm"
)

type Budget struct {
	gorm.Model
	UserID     uint    `json:"userId" gorm:"not null;index"`
	CategoryID uint    `json:"categoryId" gorm:"not null;index"`
	Amount     float64 `json:"amount" gorm:"not null"`
	Spent      float64 `json:"spent" gorm:"default:0"`
	Remaining  float64 `json:"remaining" gorm:"default:0"`
	IsFixed    bool    `json:"isFixed" gorm:"default:false"`    // Whether this is a fixed expense
	IsFlexible bool    `json:"isFlexible" gorm:"default:false"` // Whether this budget is flexible
	MinAmount  float64 `json:"minAmount" gorm:"default:0"`      // Minimum amount for flex budgeting
	MaxAmount  float64 `json:"maxAmount" gorm:"default:0"`      // Maximum amount for flex budgeting
	Progress   float64 `json:"progress" gorm:"default:0"`       // Budget progress as percentage
}

// BudgetSummary represents the budget overview
type BudgetSummary struct {
	TotalBudgeted    float64 `json:"totalBudgeted"`
	TotalSpent       float64 `json:"totalSpent"`
	TotalRemaining   float64 `json:"totalRemaining"`
	FixedExpenses    float64 `json:"fixedExpenses"`
	FlexibleExpenses float64 `json:"flexibleExpenses"`
}
