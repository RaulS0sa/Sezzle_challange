package main

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"unicode"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CalcRequest struct {
	Expression string `json:"expression"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/calculate", func(c *gin.Context) {
		var req CalcRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Clean input: replace UI symbols with math symbols
		expr := strings.ReplaceAll(req.Expression, " ", "")

		res, err := evaluate(expr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"result": res})
	})

	r.Run(":8080")
}

func evaluate(s string) (float64, error) {
	chars := []rune(s)
	pos := 0
	return parseExpression(chars, &pos)
}

func parseExpression(s []rune, i *int) (float64, error) {
	var stack []float64
	num := 0.0
	sign := '+'

	for *i < len(s) {
		char := s[*i]

		if unicode.IsDigit(char) || char == '.' {
			start := *i
			for *i < len(s) && (unicode.IsDigit(s[*i]) || s[*i] == '.') {
				*i++
			}
			num, _ = strconv.ParseFloat(string(s[start:*i]), 64)
			*i--
		} else if char == '(' {
			*i++
			val, err := parseExpression(s, i)
			if err != nil {
				return 0, err
			}
			num = val
		} else if unicode.IsLetter(char) {
			// Handle sqrt(x)
			if strings.HasPrefix(string(s[*i:]), "sqrt") {
				*i += 4
				if *i < len(s) && s[*i] == '(' {
					*i++
					val, err := parseExpression(s, i)
					if err != nil {
						return 0, err
					}
					if val < 0 {
						return 0, fmt.Errorf("invalid input: %f", val)
					}
					num = math.Sqrt(val)
				}
			}
		}

		// Process operation
		isOp := !unicode.IsDigit(char) && !unicode.IsSpace(char) && char != '.' && !unicode.IsLetter(char)
		if isOp || *i == len(s)-1 {
			switch sign {
			case '+':
				stack = append(stack, num)
			case '-':
				stack = append(stack, -num)
			case '*':
				stack[len(stack)-1] *= num
			case '/':
				if num == 0 {
					return 0, fmt.Errorf("division by zero")
				}
				stack[len(stack)-1] /= num
			case '^':
				stack[len(stack)-1] = math.Pow(stack[len(stack)-1], num)
			case '%':
				stack[len(stack)-1] = math.Mod(stack[len(stack)-1], num)
			}
			if char == ')' {
				break
			}
			sign = char
			num = 0
		}
		*i++
	}

	sum := 0.0
	for _, v := range stack {
		sum += v
	}
	return sum, nil
}
