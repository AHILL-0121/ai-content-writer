package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var Database *mongo.Database

func Connect() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/content_generator"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(mongoURI)

	var err error
	Client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Ping the database to verify connection
	err = Client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	// Get database name from URI or use default
	Database = Client.Database("content_generator")

	log.Println("MongoDB connected successfully")

	// Create indexes for better performance
	createIndexes()
}

func createIndexes() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Users collection indexes
	usersCollection := Database.Collection("users")
	_, err := usersCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]interface{}{"email": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Printf("Warning: Failed to create users email index: %v", err)
	}

	// Chats collection indexes
	chatsCollection := Database.Collection("chats")
	_, err = chatsCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{"user_id": 1},
	})
	if err != nil {
		log.Printf("Warning: Failed to create chats user_id index: %v", err)
	}

	// Drafts collection indexes
	draftsCollection := Database.Collection("drafts")
	_, err = draftsCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: map[string]interface{}{"user_id": 1},
	})
	if err != nil {
		log.Printf("Warning: Failed to create drafts user_id index: %v", err)
	}

	log.Println("MongoDB indexes created successfully")
}

func Disconnect() {
	if Client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := Client.Disconnect(ctx); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		} else {
			log.Println("MongoDB disconnected successfully")
		}
	}
}
