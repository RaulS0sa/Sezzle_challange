***

# Full-Stack Scientific Calculator

A professional-grade calculator application featuring a **Go (Gin)** microservice for arithmetic logic and a **React (TypeScript)** frontend inspired by modern scientific calculator layouts.

## 🚀 Overview

This project fulfills the Sezzle technical assessment by providing a robust calculator capable of basic and advanced operations, including nested expressions, exponentiation, and square roots. 

### Key Features
- **Advanced Logic**: Supports parentheses `( )`, Exponentiation `^`, Square Root `sqrt()`, and Percentage.
- **Smart Input**: Frontend logic handles implicit multiplication (e.g., typing `5(` automatically becomes `5*(`).
- **Responsive Design**:  6-column grid optimized for desktop and mobile.
- **Robust Parsing**: A custom stack-based recursive parser in Go (avoiding dangerous `eval()` patterns).

---

## 🛠 Tech Stack

- **Backend**: Go (Golang) with the **Gin Gonic** framework.
- **Frontend**: React 18, TypeScript, Tailwind CSS, and Lucide Icons.
- **Testing**: Go `testing` package with `httptest` for API validation.

## 🧪 Testing & Coverage
### Backend (Go)
To run tests and see the coverage report:
```bash
cd server
go test -v -coverprofile=coverage.out ./...
go tool cover -func=coverage.out

---

## 🧠 Design Decisions & Rationale

### 1. The "Recursive Descent" Parser (Backend)
Rather than using basic string splitting or external libraries, I implemented a custom parser.
- **Why?** Standard string splitting fails on mathematical precedence (Multiplication before Addition) and nested parentheses. This implementation uses a recursive approach to evaluate sub-expressions within parentheses first, ensuring mathematical correctness (PEMDAS).
- **Safety**: By manually parsing the string, we eliminate "Code Injection" risks associated with expression evaluation.

### 2. "Smart Append" Logic (Frontend)
The UI handles the "messy" parts of user input before it reaches the API.
- **Implicit Multiplication**: If a user types `5(`, the UI appends `5*(`.
- **State Awareness**: If a result is currently displayed and the user types a number, it starts a new calculation. If they type an operator, it chains the previous result into a new expression.
- **Percentage Handling**: Following standard calculator behavior, the `%` button appends `/100` to the expression string to treat it as a unary operator.

### 3. Error Boundary & Edge Cases
- **Division by Zero**: Explicitly caught in the Go backend, returning a 400 Bad Request with a clear message.
- **Negative Square Roots**: Handled with validation logic to prevent `NaN` results.
- **Malformed Inputs**: The parser is tested against partial parentheses and invalid characters.

---

## 🏃 Setup Instructions

### Prerequisites
- [Go](https://go.dev/doc/install) (1.20 or later)
- [Node.js](https://nodejs.org/) (18.x or later)

### 1. Run the Backend
```bash
cd server
go mod tidy
go run main.go
```
*The server will start on `http://localhost:8080`*

### 2. Run the Frontend
```bash
cd client
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`*

---

## 🧪 Testing

The backend includes a comprehensive test suite covering basic math, operator precedence, advanced functions, and API endpoint integrity.

To run the tests and see the coverage:
```bash
cd server
go test -v
```

---

## 📡 API Documentation

### Calculate Expression
Performs mathematical evaluation on a string expression.

- **URL**: `/calculate`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Sample Request**:
```json
{
  "expression": "sqrt(16) + 2^3"
}
```

**Sample Response**:
```json
{
  "result": 12
}
```

**Error Response (400)**:
```json
{
  "error": "division by zero"
}
```

---

## 📝 Prompts Used
- *Logic for recursive descent parser in Go for mathematical expressions.*
- *React state management for calculator input chaining and implicit multiplication.*
- *Tailwind CSS configurations for a 6-column scientific calculator grid.*
- *VS Code Compound Launch configurations for multi-service debugging.*

---

**Developed by Raul Sosa**