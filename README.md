# Rawda – Smart Home Gardening Assistant

Rawda is a full-stack web application developed as part of the SWE363 course project. The platform assists home gardeners by providing an organized and user-friendly digital environment where they can manage plants, receive guidance, communicate with experts, and interact with gardening services.

## Project Overview

Rawda connects home gardeners with gardening experts, plant stores, and an admin control panel through a modern web interface. The application includes a complete REST API backend built with Node.js and MongoDB.

---

## Main Features

- User authentication with JWT (Gardener, Expert, Store, Admin)
- Gardener dashboard and plant management
- Interactive chatbot for plant-care assistance
- Q&A Forum with expert answers
- Plant care guides created by experts
- Nearby gardening store browsing
- Service booking and management
- Product and service management for stores
- Admin control panel for user and content management
- Ratings and reviews system

---

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Lucide React Icons
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- dotenv
- Morgan
- CORS

---

## Installation and Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Somaiakha/SWE-363-Rawda.git
cd SWE-363-Rawda
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
Open: http://localhost:5173

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a file named `.env` inside the `backend/` folder with the following content:

```
PORT=5050
MONGO_URI=mongodb+srv://s202257820_db_user:xUswh868a7GOKvyt@cluster0.ibjj5ka.mongodb.net/gardening_system
JWT_SECRET=Web_project_252
```

Then start the backend server:
```bash
npm run dev
```
Server runs on: http://localhost:5050

---

## Demo Credentials

Use these accounts to test each role. The database is hosted on MongoDB Atlas — no local setup required.

| Role | Email | Password |
|------|-------|----------|
| Gardener | ahmed@test.com | test1234 |
| Expert | somaia@gmail.com | yourpassword |
| Admin | sara@test.com | test1234 |
| Store | store@test.com | test1234 |

> Each role has its own login page. Select the role from the home screen (`http://localhost:5173`) to be directed to the correct login page.

---

## API Documentation

### Auth Routes `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get token |

### User Routes `/api/users`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

### Question Routes `/api/questions`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all questions |
| GET | `/:id` | Get question by ID |
| POST | `/` | Create question (auth required) |
| POST | `/:id/answers` | Add answer (auth required) |
| POST | `/:id/like` | Like a question (auth required) |
| POST | `/:id/bookmark` | Bookmark a question (auth required) |

### Guide Routes `/api/guides`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all guides |
| POST | `/` | Submit a guide |
| PUT | `/:id/status` | Approve or reject a guide (Expert) |

### Service Routes `/api/services`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all services |
| POST | `/` | Create service |
| PUT | `/:id` | Update service |
| DELETE | `/:id` | Delete service |

### Product Routes `/api/products`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products |
| POST | `/` | Create product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5050) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |

---

## Team Work Distribution

| Team Member | Assigned Responsibility |
|-------------|------------------------|
| Sadeem Ahmed Alghamdi | Gardener Interfaces + Backend |
| Raghada Alqarawi | Admin Interfaces + Backend |
| Somaia Khawaji | Expert Interfaces + Backend |
| Anwar Almutairi | Store Interfaces + Backend |

---

## Folder Structure

```
SWE-363-Rawda/
├── src/                    # Frontend React app
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── layouts/        # Layout components
│   │   └── pages/          # Page components
│   ├── api/                # API helper functions
│   └── context/            # Auth context
├── backend/                # Backend Node.js app
│   ├── config/             # Database connection
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
├── index.html
├── package.json
└── vite.config.js
```
