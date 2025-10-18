package routes

import (
	"github.com/gofiber/fiber/v2"

	"backend/controllers"
)

func SetupAuthRoutes(router fiber.Router) {
	auth := router.Group("/auth")

	auth.Post("/signup", controllers.Signup)
	auth.Post("/login", controllers.Login)
}
