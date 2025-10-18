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

type CreateDraftRequest struct {
	Title   string `json:"title" validate:"required"`
	Content string `json:"content" validate:"required"`
}

func CreateDraft(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	var req CreateDraftRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	collection := db.Database.Collection("drafts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	draft := models.Draft{
		ID:        primitive.NewObjectID(),
		UserID:    userObjID,
		Title:     req.Title,
		Content:   req.Content,
		Status:    "draft",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err := collection.InsertOne(ctx, draft)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create draft",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Draft created successfully",
		"draft":   draft,
	})
}

func GetDrafts(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	collection := db.Database.Collection("drafts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userObjID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch drafts",
		})
	}
	defer cursor.Close(ctx)

	var drafts []models.Draft
	if err = cursor.All(ctx, &drafts); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to decode drafts",
		})
	}

	if drafts == nil {
		drafts = []models.Draft{}
	}

	return c.JSON(fiber.Map{
		"drafts": drafts,
	})
}

func GetDraft(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	draftID := c.Params("id")

	draftObjID, err := primitive.ObjectIDFromHex(draftID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid draft ID",
		})
	}

	collection := db.Database.Collection("drafts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var draft models.Draft
	err = collection.FindOne(ctx, bson.M{
		"_id":     draftObjID,
		"user_id": userObjID,
	}).Decode(&draft)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Draft not found",
		})
	}

	return c.JSON(draft)
}

func UpdateDraft(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	draftID := c.Params("id")

	draftObjID, err := primitive.ObjectIDFromHex(draftID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid draft ID",
		})
	}

	collection := db.Database.Collection("drafts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var draft models.Draft
	err = collection.FindOne(ctx, bson.M{
		"_id":     draftObjID,
		"user_id": userObjID,
	}).Decode(&draft)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Draft not found",
		})
	}

	var req CreateDraftRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	draft.Title = req.Title
	draft.Content = req.Content
	draft.UpdatedAt = time.Now()

	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": draftObjID},
		bson.M{"$set": bson.M{
			"title":      req.Title,
			"content":    req.Content,
			"updated_at": time.Now(),
		}},
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update draft",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Draft updated successfully",
		"draft":   draft,
	})
}

func DeleteDraft(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	draftID := c.Params("id")

	draftObjID, err := primitive.ObjectIDFromHex(draftID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid draft ID",
		})
	}

	collection := db.Database.Collection("drafts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{
		"_id":     draftObjID,
		"user_id": userObjID,
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete draft",
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Draft not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Draft deleted successfully",
	})
}
