# Workspace Portal (React + Chakra UI + Java Spring Boot MVC + Supabase)

A simple, clean full-stack web application in English with **Java Spring Boot MVC** on the backend, **React + Chakra UI** on the frontend, and **Supabase + BCrypt** for user authentication.

## Architecture (MVC)

### Backend (`backend/` — Java Spring Boot)
- **Model:**
  - `model/User.java` — User entity (`id`, `fullName`, `email`, `username`, `passwordHash`)
  - `model/UserRepository.java` — Supabase REST client (`findByUsername`, `findByEmail`, `save`)
- **Service:**
  - `service/AuthService.java` — Password hashing and verification with `BCryptPasswordEncoder`
- **Controller:**
  - `controller/AuthController.java` — REST endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`) using `HttpSession` (`HttpOnly` cookie)

### Frontend (`frontend/` — React + Chakra UI)
- `components/LoginView.tsx` — Sign In & Create Account (`Full Name`, `Email`, `Username`, `Password`)
- `components/DashboardView.tsx` — **Sum** and **Calculator** buttons
- `components/SumView.tsx` — Sum module placeholder
- `components/CalculatorView.tsx` — Mobile-style calculator

## How to Run

### 1. Supabase
Run [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase **SQL Editor**.

### 2. Backend (Spring Boot)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Runs on `http://localhost:4000`.

### 3. Frontend (React)
```powershell
cd frontend
npm.cmd run dev
```
Runs on `http://localhost:5174` (or `5173`).
