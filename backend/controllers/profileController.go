package controllers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"backend/db"
	"backend/models"
)

type UpdateProfileRequest struct {
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
}

func GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	collection := db.Database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"id":         user.ID.Hex(),
		"name":       user.Name,
		"email":      user.Email,
		"avatar_url": user.AvatarURL,
		"created_at": user.CreatedAt,
	})
}

func UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	collection := db.Database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	var req UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	updateFields := bson.M{"updated_at": time.Now()}
	if req.Name != "" {
		user.Name = req.Name
		updateFields["name"] = req.Name
	}
	if req.AvatarURL != "" {
		user.AvatarURL = req.AvatarURL
		updateFields["avatar_url"] = req.AvatarURL
	}

	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": userObjID},
		bson.M{"$set": updateFields},
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update profile",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Profile updated successfully",
		"user": fiber.Map{
			"id":         user.ID.Hex(),
			"name":       user.Name,
			"email":      user.Email,
			"avatar_url": user.AvatarURL,
		},
	})
}
