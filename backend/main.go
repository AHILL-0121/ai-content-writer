package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"backend/db"
	"backend/routes"
)

func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
		log.Println("Trying to use system environment variables...")
	} else {
		log.Println(".env file loaded successfully")
	}

	// Initialize database
	db.Connect()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "AI Content Generator API",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// API Routes
	api := app.Group("/api")
	routes.SetupAuthRoutes(api)
	routes.SetupChatRoutes(api)
	routes.SetupDraftRoutes(api)
	routes.SetupProfileRoutes(api)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
