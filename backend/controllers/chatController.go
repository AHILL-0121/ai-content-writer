package controllers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"backend/db"
	"backend/models"
	"backend/services"
)

type SendMessageRequest struct {
	ChatID  *string `json:"chat_id"`
	Message string  `json:"message" validate:"required"`
	Model   string  `json:"model"` // "ollama" or "gemini"
}

var aiService *services.AIService

func SendMessage(c *fiber.Ctx) error {
	if aiService == nil {
		aiService = services.NewAIService()
	}

	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	var req SendMessageRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	collection := db.Database.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	var chat models.Chat
	var messages []models.Message

	// If chat_id is provided, load existing chat
	if req.ChatID != nil && *req.ChatID != "" {
		chatObjID, err := primitive.ObjectIDFromHex(*req.ChatID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid chat ID",
			})
		}

		err = collection.FindOne(ctx, bson.M{
			"_id":     chatObjID,
			"user_id": userObjID,
		}).Decode(&chat)

		if err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Chat not found",
			})
		}

		messages = chat.Messages
	}

	// Add user message
	userMessage := models.Message{
		Role:      "user",
		Content:   req.Message,
		Timestamp: time.Now(),
	}
	messages = append(messages, userMessage)

	// Generate AI response
	fmt.Println("Calling AI service with message:", req.Message)

	// Use model from request or default from environment
	var aiResponse string
	var err error
	if req.Model != "" {
		// Create temporary AI service with specified model
		tempService := services.NewAIServiceWithModel(req.Model)
		aiResponse, err = tempService.GenerateResponse(req.Message)
	} else {
		aiResponse, err = aiService.GenerateResponse(req.Message)
	}

	if err != nil {
		fmt.Println("AI service error:", err)
		aiResponse = "Sorry, I encountered an error generating a response: " + err.Error()
	} else {
		previewLen := 50
		if len(aiResponse) < previewLen {
			previewLen = len(aiResponse)
		}
		fmt.Println("AI response received:", aiResponse[:previewLen])
	}

	aiMessage := models.Message{
		Role:      "assistant",
		Content:   aiResponse,
		Timestamp: time.Now(),
	}
	messages = append(messages, aiMessage)

	// Create or update chat
	if req.ChatID == nil || *req.ChatID == "" {
		chat = models.Chat{
			ID:        primitive.NewObjectID(),
			UserID:    userObjID,
			Title:     truncateString(req.Message, 50),
			Messages:  messages,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		_, err = collection.InsertOne(ctx, chat)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create chat",
			})
		}
	} else {
		chat.Messages = messages
		chat.UpdatedAt = time.Now()

		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": chat.ID},
			bson.M{"$set": bson.M{
				"messages":   messages,
				"updated_at": time.Now(),
			}},
		)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update chat",
			})
		}
	}

	return c.JSON(fiber.Map{
		"chat_id":  chat.ID.Hex(),
		"message":  aiMessage,
		"messages": messages,
	})
}

func GetChatHistory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	collection := db.Database.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userObjID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch chat history",
		})
	}
	defer cursor.Close(ctx)

	var chats []models.Chat
	if err = cursor.All(ctx, &chats); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to decode chats",
		})
	}

	if chats == nil {
		chats = []models.Chat{}
	}

	return c.JSON(fiber.Map{
		"chats": chats,
	})
}

func GetChat(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	chatID := c.Params("id")

	chatObjID, err := primitive.ObjectIDFromHex(chatID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid chat ID",
		})
	}

	collection := db.Database.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var chat models.Chat
	err = collection.FindOne(ctx, bson.M{
		"_id":     chatObjID,
		"user_id": userObjID,
	}).Decode(&chat)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Chat not found",
		})
	}

	return c.JSON(chat)
}

func DeleteChat(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	chatID := c.Params("id")

	chatObjID, err := primitive.ObjectIDFromHex(chatID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid chat ID",
		})
	}

	collection := db.Database.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{
		"_id":     chatObjID,
		"user_id": userObjID,
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete chat",
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Chat not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Chat deleted successfully",
	})
}

func truncateString(str string, length int) string {
	if len(str) <= length {
		return str
	}
	return str[:length] + "..."
}

func UpdateChatTitle(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	chatID := c.Params("id")

	chatObjID, err := primitive.ObjectIDFromHex(chatID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid chat ID",
		})
	}

	var req struct {
		Title string `json:"title" validate:"required"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	collection := db.Database.Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.UpdateOne(
		ctx,
		bson.M{
			"_id":     chatObjID,
			"user_id": userObjID,
		},
		bson.M{
			"$set": bson.M{
				"title":      req.Title,
				"updated_at": time.Now(),
			},
		},
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update chat title",
		})
	}

	if result.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Chat not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Chat title updated successfully",
		"title":   req.Title,
	})
}
