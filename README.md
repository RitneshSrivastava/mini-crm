# mini-crm
A full-stack customer relationship management (CRM) platform built with Spring Boot, React, MySQL, and Kafka.
#  Mini CRM Platform – Xeno SDE Internship Assignment 2025

Welcome to the Mini CRM platform – a full-stack CRM solution designed for customer segmentation, campaign delivery, and AI-powered rule creation. Built as part of the Xeno SDE Internship 2025 assignment.

---


 **Google OAuth Login Required**

---

##  Features Implemented

### 1. **Authentication**
- Google OAuth 2.0 login
- JWT secured backend API
- React protected routes based on token

### 2. **Customer & Order Ingestion**
- Add customers and orders via secure REST APIs
- Data passed through Kafka topics and saved by consumer services asynchronously
- Swagger UI for testing APIs

### 3. **Segment Rule Builder**
- Dynamic rule builder using `AND/OR` logic for customer segmentation
- Supports fields: `age`, `location`, `gender`, `signupDate`, etc.
- Validates rule syntax and previews audience

### 4. **AI Rule Generator**
- Integrates OpenAI GPT-3 to convert plain English prompts into structured rule logic  
  _Example: “People in Mumbai over 30” → `location = Mumbai AND age > 30`_

### 5. **Campaign Creation & Delivery**
- Create campaigns for selected segments
- Messages sent to each customer via dummy vendor API
- Simulates real-world success/failure (90% SENT, 10% FAILED)
- Logs messages via Kafka into `communication_log` table

### 6. **Campaign Stats Dashboard**
- View past campaigns with stats:
  - Sent / Failed / Total
  - Success Rate (%)

---

##  Screenshots

---

##  Tech Stack

###  Backend
- **Spring Boot 3.5**
- **Kafka** (Confluent Cloud)
- **MySQL** (Clever Cloud)
- **JWT + OAuth2**
- **OpenAI GPT-3 API**
- **Swagger UI**

###  Frontend
- **React (Vite)**
- **Axios** for API requests
- **React Router**, `PrivateRoute` for JWT auth
- **Tailwind CSS** for UI

---

##  Architecture Overview

```plaintext
Frontend (React + Vite)
        |
        | -> Login via Google OAuth
        | <- JWT received after OAuth
        |
        | -> Authenticated REST API calls
        v
Backend (Spring Boot)
  - Validates & routes requests
  - Sends data to Kafka
  - Serves campaign stats and segments
        |
        v
Kafka (Confluent Cloud)
  - Handles async ingestion (Customer, Order, Logs)
        |
        v
Consumers
  - Persist data to MySQL
        |
        v
Database (MySQL - Clever Cloud)
```
##  How to Run Locally
1. Clone the Repo
   git clone https://github.com/yourusername/mini-crm-xeno.git
   cd mini-crm-xeno

2. Start Backend
   cd backend
  ./mvnw spring-boot:run
   Ensure MySQL is running locally OR use your production application-production.properties.
   Kafka required – you can run locally with docker-compose up or use Confluent Cloud.
   
3.Start Frontend
  cd frontend
  npm install
  npm run dev
  
Visit: http://localhost:5173


 Contact
 Email: ritneshntv@gmail.com
 LinkedIn: https://linkedin.com/in/ritneshks



❤️ Made with love for Xeno


