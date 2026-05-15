***

# Full-Stack Scientific Calculator (Sezzle Technical Assessment)

A professional-grade calculator application featuring a **Go (Gin)** microservice for arithmetic logic and a **React (TypeScript)** frontend inspired by modern scientific calculator layouts.

## 🚀 Overview

This project fulfills the Sezzle technical assessment by providing a robust calculator capable of basic and advanced operations, including nested expressions, exponentiation, and square roots.

### Key Features
- **Advanced Logic**: Supports parentheses `( )`, Exponentiation `^`, Square Root `sqrt()`, and Percentage.
- **Smart Input**: Frontend logic handles implicit multiplication (e.g., typing `5(` automatically becomes `5*(`) and context-aware state resets.
- **Responsive Design**: A sleek, dark-mode 6-column grid optimized for both desktop and mobile use.
- **Robust Parsing**: A custom stack-based recursive parser in Go that ensures mathematical correctness without using risky `eval()` patterns.

---

## 🛠 Tech Stack

- **Backend**: Go (Golang) with the **Gin Gonic** framework.
- **Frontend**: React 18, TypeScript, Tailwind CSS, and Lucide Icons.
- **Testing**: Go `testing` package (Backend) and Vitest with Istanbul (Frontend).

---

## 🧠 Design Decisions & Rationale

### 1. The "Recursive Descent" Parser (Backend)
Rather than using basic string splitting or external libraries, I implemented a custom parser.
- **Why?** Standard string splitting fails on mathematical precedence (Multiplication before Addition) and nested parentheses. This implementation uses a recursive approach to evaluate sub-expressions within parentheses first, ensuring mathematical correctness (PEMDAS).
- **Safety**: By manually parsing the string runes, we eliminate "Code Injection" risks associated with expression evaluation.

### 2. Decoupled Logic & "Smart Append" (Frontend)
To ensure the code is "maintainable and testable" (as per requirements), I decoupled the input state machine from the UI.
- **Rationale**: The core logic resides in `calculatorLogic.ts`. This allows for high-speed unit testing without mounting components.
- **Implicit Multiplication**: The logic detects transitions between digits and parentheses (e.g., `5(`) and automatically inserts the `*` operator to prevent syntax errors in the backend.

### 3. Error Boundary & Edge Cases
- **Division by Zero**: Explicitly caught in the Go backend, returning a 400 Bad Request.
- **Negative Square Roots**: Handled with validation logic to return a user-friendly error instead of `NaN`.
- **Malformed Inputs**: The parser and frontend work in tandem to sanitize inputs like `++` or empty parentheses.

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

dependencies if missing:
```
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
```
*The server will start on `http://localhost:8080`*

### 2. Run the Frontend
```bash
cd client
npm install
npm run dev
```

dependencies if missing:
```
npm install lucide-react
npm install -D vitest @vitest/coverage-istanbul jsdom

```
*The UI will be available at `http://localhost:5173`*

---

## 🧪 Testing & Coverage

### Backend (Go) - 73.8% Coverage
The backend includes a comprehensive test suite covering basic math, operator precedence, advanced functions, and API endpoint integrity.

**Run tests:**
```bash
cd server
go test -v -coverprofile=coverage.out ./...
```
**View visual report:**
```bash
go tool cover -html=coverage.out -o coverage.html
```

### Frontend (React) - 66.7% Coverage
Unit tests verify the "Smart Input" state machine to ensure valid expressions are sent to the API.

**Run tests:**
```bash
cd client
npm run coverage
```

| File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **All files** | **66.66** | **62.85** | **100** | **75** | |
| calculatorLogic.ts | 66.66 | 62.85 | 100 | 75 | 9, 14, 23-24, 31 |

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

---

## 📝 Prompts Used
As required by the assessment instructions, here are the prompts used to assist development:
- *Logic for recursive descent parser in Go for mathematical expressions.*
- *Refactor React state logic into a pure TypeScript function to handle implicit multiplication for better testability.*
- *Tailwind CSS configurations for a 6-column scientific calculator grid.*
- *VS Code Compound Launch configurations for multi-service debugging.*
- *Configure Vitest coverage report using the Istanbul provider to resolve macOS Node.js 22 segmentation faults.*

---

**Developed by Raul Sosa**