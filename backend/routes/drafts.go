package routes

import (
	"github.com/gofiber/fiber/v2"

	"backend/controllers"
	"backend/middlewares"
)

func SetupDraftRoutes(router fiber.Router) {
	drafts := router.Group("/drafts", middlewares.AuthRequired())

	drafts.Post("/create", controllers.CreateDraft)
	drafts.Get("/", controllers.GetDrafts)
	drafts.Get("/:id", controllers.GetDraft)
	drafts.Put("/:id", controllers.UpdateDraft)
	drafts.Delete("/:id", controllers.DeleteDraft)
}
