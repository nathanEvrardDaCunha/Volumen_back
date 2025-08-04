# Volumen (Backend)

## Overview

This repository contains the source code for the Volumen backend server. This robust and secure RESTful API, built with Node.js, Express, TypeScript, and PostgreSQL, provides all the necessary services for the Volumen book discovery and reading preferences application. It handles user authentication, real-time Google Books API integration, data persistence, and core business logic for managing multi-user reading preferences.

The frontend client for this application is maintained in a separate repository. You can find the frontend source code [here](https://github.com/nathanEvrardDaCunha/Volumen_front).

---

## API Features

The backend exposes a comprehensive set of endpoints to support the application's functionality, following RESTful principles and integrating seamlessly with external book data sources.

### **Authentication & Authorization**

-   **User Endpoint (`/api/users`):** Manages user creation, retrieval, updates, and deletion with personalized reading profiles.
-   **Auth Endpoint (`/api/auth`):** Handles user login, session management, and password changes.
-   **Token Service:** Generates and validates stateless JSON Web Tokens (JWT) for secure communication. An authentication middleware protects sensitive routes.
-   **Password Recovery:** Sends temporary passwords to a registered user's email address for account recovery.

### **Core Functionality**

-   **Search Endpoint (`/api/books`):** Provides real-time book search capabilities through Google Books API integration, delivering comprehensive book metadata and cover images.
-   **Reading Preferences Endpoint (`/api/shelves`):** Manages user reading preferences, favorite genres, reading lists, and personalized recommendations.
-   **Books Endpoint (`/api/books`):** Handles book data persistence, user ratings, reviews, and reading status tracking.

### **External API Integration**

-   **Google Books API Integration:** Real-time search and retrieval of book information including titles, authors, descriptions, publication data, and cover images.

### **System & Error Handling**

-   **Error Middleware:** A centralized middleware gracefully handles both expected and unexpected application errors, ensuring standardized error responses.
-   **Data Validation:** Implements rigorous validation and sanitization on all incoming client data to prevent common vulnerabilities and ensure data integrity.

---

## System Architecture & Technology

The backend is built on a modern, robust technology stack, architected for scalability and maintainability with optimized database design for multi-user reading preferences.

| Category       | Technology / Tool                           |
| -------------- | ------------------------------------------- |
| **Core**       | JavaScript, Node.js, Express.js, TypeScript |
| **Database**   | PostgreSQL, SQL                            |
| **Security**   | jsonwebtoken, bcrypt, zod                       |
| **External APIs** | Google Books API, nodemailer                         |
| **Styling**    | Sass, CSS3                                 |
| **Tooling**    | Git, npm, GitHub                          |
| **Deployment** | Docker                                     |

The application follows a layered architecture, separating concerns into distinct modules:

-   **Routes:** Define the API endpoints and handle HTTP routing.
-   **Controllers:** Handle incoming requests and outgoing responses with proper error handling.
-   **Services:** Contain the core business logic including Google Books API integration and preference algorithms.
-   **Models/Data Access Layer:** Manage all interactions with the PostgreSQL database, optimized for multi-user reading data.

---

## Local Development Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nathanEvrardDaCunha/Volumen_back.git
    cd Volumen_back
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. Use the `.env.example` file as a template and populate it with your local configuration.

    ```env
    # App Configuration
    APP_ENV=your-environment
    API_URL=your-api-url
    API_PORT=your-api-port
    FRONT_URL=your-frontend-url
    FRONT_PORT=your-frontend-port

    # Database Configuration
    DATABASE_USER=your-db-user
    DATABASE_PASSWORD=your-local-db-password
    DATABASE_NAME=your-db-name
    DATABASE_HOST=your-db-host
    DATABASE_PORT=your-db-port
    DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

    # Security
    BCRYPT_HASHING_ROUND=your-number-of-turn

    # Json Web Token
    ACCESS_TOKEN=your-first-64-random-hex-to-string
    REFRESH_TOKEN=your-second-64-random-hex-to-string

    # Email Configuration
    EMAIL_HOST=your-email-host
    EMAIL_PORT=your-email-port
    EMAIL_USER=your-email-user
    EMAIL_PASSWORD=your-email-password
    EMAIL_FROM=your-email-from

    # Google Book API
    GOOGLE_BOOK_API=your-google-book-api-key
    ```

    _Ensure you have a local PostgreSQL instance running and have created the `volumen` database._

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## Deployment on Railway

**[Work in Progress]**

The application is configured for deployment on Railway. Detailed deployment instructions will be provided soon.

---

## Project Retrospective & Key Learnings

**[Work in Progress]**

This section will outline key challenges faced during development and the engineering solutions implemented, including insights on Google Books API integration, multi-user database optimization, and responsive interface development.

---

## Conclusion

**[Work in Progress]**

A comprehensive summary of the development experience and skills gained will be provided upon project completion, highlighting the technical achievements in building a scalable book discovery and reading preferences platform.