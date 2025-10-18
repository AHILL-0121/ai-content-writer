package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// AIService handles AI integration (Gemini or Ollama)
type AIService struct {
	UseGemini bool
	UseOllama bool
}

// NewAIService creates a new AI service instance
func NewAIService() *AIService {
	useGeminiStr := os.Getenv("USE_GEMINI")
	useOllamaStr := os.Getenv("USE_OLLAMA")

	fmt.Printf("Environment variables: USE_GEMINI='%s', USE_OLLAMA='%s'\n", useGeminiStr, useOllamaStr)

	useGemini := strings.ToLower(useGeminiStr) == "true"
	useOllama := strings.ToLower(useOllamaStr) == "true"

	fmt.Printf("Parsed values: useGemini=%v, useOllama=%v\n", useGemini, useOllama)

	return &AIService{
		UseGemini: useGemini,
		UseOllama: useOllama,
	}
}

// NewAIServiceWithModel creates an AI service with a specific model
func NewAIServiceWithModel(modelType string) *AIService {
	useGemini := strings.ToLower(modelType) == "gemini"
	useOllama := strings.ToLower(modelType) == "ollama"

	fmt.Printf("Creating AI service with model: %s (useGemini=%v, useOllama=%v)\n", modelType, useGemini, useOllama)

	return &AIService{
		UseGemini: useGemini,
		UseOllama: useOllama,
	}
}

// GenerateResponse generates an AI response based on the user message
func (s *AIService) GenerateResponse(userMessage string) (string, error) {
	if s.UseGemini {
		return s.callGeminiAPI(userMessage)
	} else if s.UseOllama {
		return s.callOllamaAPI(userMessage)
	}

	// Fallback placeholder response
	return "This is a placeholder AI response. Please configure Gemini API or Ollama in your .env file.", nil
}

// callGeminiAPI calls Google's Gemini API
func (s *AIService) callGeminiAPI(prompt string) (string, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY not configured")
	}

	model := os.Getenv("GEMINI_MODEL")
	if model == "" {
		model = "gemini-pro"
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey)

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": prompt},
				},
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Gemini API error: %s", string(body))
	}

	var result struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if len(result.Candidates) > 0 && len(result.Candidates[0].Content.Parts) > 0 {
		return result.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no response from Gemini API")
}

// callOllamaAPI calls local Ollama API
func (s *AIService) callOllamaAPI(prompt string) (string, error) {
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}

	model := os.Getenv("OLLAMA_MODEL")
	if model == "" {
		model = "llama2"
	}

	url := fmt.Sprintf("%s/api/generate", ollamaURL)

	requestBody := map[string]interface{}{
		"model":  model,
		"prompt": prompt,
		"stream": false,
		"options": map[string]interface{}{
			"temperature": 0.7,
			"num_predict": 2000, // Allow longer responses
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	// Create HTTP client with longer timeout (60 seconds)
	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ollama: %w (make sure Ollama is running)", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Ollama API error: %s", string(body))
	}

	var result struct {
		Response string `json:"response"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if result.Response == "" {
		return "", fmt.Errorf("no response from Ollama")
	}

	return result.Response, nil
}
