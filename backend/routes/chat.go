package routes

import (
	"github.com/gofiber/fiber/v2"

	"backend/controllers"
	"backend/middlewares"
)

func SetupChatRoutes(router fiber.Router) {
	chat := router.Group("/chat", middlewares.AuthRequired())

	chat.Post("/send", controllers.SendMessage)
	chat.Get("/history", controllers.GetChatHistory)
	chat.Get("/:id", controllers.GetChat)
	chat.Delete("/:id", controllers.DeleteChat)
	chat.Put("/:id/title", controllers.UpdateChatTitle)
}
