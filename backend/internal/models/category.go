package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name       string  `json:"name" gorm:"not null"`
	UserID     uint    `json:"userId" gorm:"not null;default:1"`
	Amount     float64 `json:"amount" gorm:"default:0"`
	Spent      float64 `json:"spent" gorm:"default:0"`
	Remaining  float64 `json:"remaining" gorm:"default:0"`
	IsFixed    bool    `json:"isFixed" gorm:"default:false"`
	IsFlexible bool    `json:"isFlexible" gorm:"default:false"`
	MinAmount  float64 `json:"minAmount" gorm:"default:0"`
	MaxAmount  float64 `json:"maxAmount" gorm:"default:0"`
	Progress   float64 `json:"progress" gorm:"default:0"`
	Color      string  `json:"color,omitempty"`
	Icon       string  `json:"icon,omitempty"`
}
