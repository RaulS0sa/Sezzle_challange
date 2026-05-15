package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestEvaluateBasicOperations(t *testing.T) {
	tests := []struct {
		input    string
		expected float64
	}{
		{"1+1", 2},
		{"2-1", 1},
		{"2*3", 6},
		{"6/2", 3},
	}

	for _, tt := range tests {
		result, err := evaluate(tt.input)
		if err != nil {
			t.Errorf("unexpected error for %s: %v", tt.input, err)
			continue
		}

		if result != tt.expected {
			t.Errorf("input %s expected %v got %v", tt.input, tt.expected, result)
		}
	}
}

func TestEvaluatePrecedence(t *testing.T) {
	tests := []struct {
		input    string
		expected float64
	}{
		{"2+3*4", 14},
		{"10-2*3", 4},
		{"(2+3)*4", 20},
		{"8/2+2", 6},
	}

	for _, tt := range tests {
		result, err := evaluate(tt.input)
		if err != nil {
			t.Errorf("unexpected error for %s: %v", tt.input, err)
			continue
		}

		if result != tt.expected {
			t.Errorf("input %s expected %v got %v", tt.input, tt.expected, result)
		}
	}
}

func TestEvaluateAdvancedOps(t *testing.T) {
	tests := []struct {
		input    string
		expected float64
	}{
		{"2^3", 8},
		{"sqrt(9)", 3},
		{"sqrt(16)+4", 8},
		{"3^2+1", 10},
	}

	for _, tt := range tests {
		result, err := evaluate(tt.input)
		if err != nil {
			t.Errorf("unexpected error for %s: %v", tt.input, err)
			continue
		}

		if result != tt.expected {
			t.Errorf("input %s expected %v got %v", tt.input, tt.expected, result)
		}
	}
}

func TestEvaluateParentheses(t *testing.T) {
	tests := []struct {
		input    string
		expected float64
	}{
		{"(1+2)*3", 9},
		{"(2+3)*(4+1)", 25},
		{"((2+2)*2)", 8},
	}

	for _, tt := range tests {
		result, err := evaluate(tt.input)
		if err != nil {
			t.Errorf("unexpected error for %s: %v", tt.input, err)
			continue
		}

		if result != tt.expected {
			t.Errorf("input %s expected %v got %v", tt.input, tt.expected, result)
		}
	}
}

func TestEvaluateDivisionByZero(t *testing.T) {
	_, err := evaluate("6/0")
	if err == nil {
		t.Errorf("expected division by zero error, got nil")
	}
}

func TestCalculateEndpoint(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.Default()

	router.POST("/calculate", func(c *gin.Context) {
		var req CalcRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		result, err := evaluate(req.Expression)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"result": result})
	})

	body := `{"expression":"2+2*2"}`

	req, _ := http.NewRequest("POST", "/calculate", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 got %d", w.Code)
	}

	expected := `{"result":6}`
	if !strings.Contains(w.Body.String(), expected) {
		t.Errorf("expected response to contain %s got %s", expected, w.Body.String())
	}
}

func TestEvaluateMissalignedInputs(t *testing.T) {
	tests := []struct {
		input    string
		expected float64
	}{
		{"", 0},
		{"(", 0},
		{")", 0},
		{"sqrt()", 0},
		{"sqrt(9", 0},
		{"2++2", 4},
		{"*2+3", 3},
		{"2+3*", 5},
		{"abc", 0},
	}
	for _, tt := range tests {
		result, err := evaluate(tt.input)
		if err != nil {
			t.Errorf("unexpected error for %s: %v", tt.input, err)
			continue
		}

		if result != tt.expected {
			t.Errorf("input %s expected %v got %v", tt.input, tt.expected, result)
		}
	}
}

func TestEvaluateInvalidInputs(t *testing.T) {
	tests := []string{
		"2/0",      // division by zero (you already handle but still test here)
		"sqrt(-9)", // invalid math domain (optional depending on your backend)
	}

	for _, input := range tests {
		_, err := evaluate(input)
		if err == nil {
			t.Errorf("expected error for input %q, got nil", input)
		}
	}
}
