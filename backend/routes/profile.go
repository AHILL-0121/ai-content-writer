package routes

import (
	"github.com/gofiber/fiber/v2"

	"backend/controllers"
	"backend/middlewares"
)

func SetupProfileRoutes(router fiber.Router) {
	profile := router.Group("/profile", middlewares.AuthRequired())

	profile.Get("/", controllers.GetProfile)
	profile.Put("/", controllers.UpdateProfile)
}
