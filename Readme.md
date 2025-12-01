
# FullStackDemo application - SpringBoot + React + MySql (Dockerised)


This is a full-stack demo application built with:

- Backend: Spring Boot (Java)
- Frontend: React
- Database: MySQL
- Reverse Proxy: Nginx
- Containerization: Docker & Docker Compose

---
# Features

User authentication with JWT
- Role-based access (e.g., Manager, Admin, Customer)
- REST APIs built with Spring Boot
- React frontend with protected routes
- MySQL database with persistent storage using Docker volumes
- Nginx serving the React build and proxying requests to backend

---

# How to run with Docker

1. Make sure Docker & Docker Compose are installed.
2. From the project root, run:  docker compose up --build
3. Open the app in your browser:
    Frontend: http://localhost:3000
    Backend API: http://localhost:8080/api/
4. To stop everything:  docker compose down

---
# Project overview

# Customer Point of View
1. To select any product (Starter and Pro Plan) create a user by signing in with CUSTOMER role and login then select project of your choice
2. The requested product will be shown and can be accepted and declined by any of the admins available

# Admin Point of View
1. To create an admin account sign in by entering details by selecting MANAGER role in sign in page
2. Once requested wait for the approval to be assigned as an ADMIN by MANAGER which can be accepted or rejected
3. Once the admin reques is accepted by MANAGER the admin can view the available products that are requested by the customers



