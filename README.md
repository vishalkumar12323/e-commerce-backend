# 🛒 E-Commerce Microservices Backend

## 📌 About

This project is a scalable and modular backend sytem for an microservices architecture. Each core feature such as authetciation, product management, and email communication is split into its own independent service to ensure flexbility, maintainability, and ease of scaling.

## 🧱 Microservices Architecture

The application folows a **microservices** approach where each service:

- Has its own database (Database per Service pattern)
- Is independently deployable
- Communicates asynchronously using **RabbitMQ** for events (where applicable)
- Is containerized using **Docker**

## ⚙️ Services & Tech Stack

1. 🔐 Auth Service
   Handles user registration, login, logout, refresh tokens, and role-based access.

- Tech Stack:
  - Node.js
  - Express.js
  - PostgreSQL (via Prisma ORM)
  - JSON Web Tokens (JWT)
  - Docker

2. 📦 Product Service
   Manages product creation, updates, deletion, and fetching. Support category-wise listing.

- Tech Stack:
  - Node.js
  - Express.js
  - PostgreSQL (via Prisma ORM)
  - Docker

3. 📧 Email Service
   Listens to events via RabbitMQ and sends transactional emails using templates.

- Tech Stack:
  - Node.js
  - Express.js (optional; mainly for health check or testing)
  - Handlebars (for email templates)
  - Nodemailer / (Pluggable SMTP provider)
  - RabbitMQ
  - Docker

## 📦 Containerization

Each service is dokerized and can be run using docker Compose for local development.

## Future Updates

- Add Order Serivce
- Add Payment Serivce
- Integrate API Gateway with rate-limiting
- Centralized Loggin & Monitoring
