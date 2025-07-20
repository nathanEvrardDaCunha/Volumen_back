# Volumen (Backend)

## Overview

This repository contains the source code for the Volumen backend server. This robust and secure RESTful API, built with Node.js, Express, and PostgreSQL, provides all the necessary services for the Modern Reader Hub Online application. It handles user authentication, book data management, and real-time integration with Google Books API to deliver a comprehensive digital reading experience.

The frontend client for this application is maintained in a separate repository. You can find the frontend source code [here](https://github.com/nathanEvrardDaCunha/Volumen_front)

---

## API Features

The backend exposes a comprehensive set of endpoints to support the application's functionality, following RESTful principles.

### **Authentication & Authorization**

-   **User Management:** Complete user lifecycle management including registration, profile updates, and account deletion.
-   **Session Management:** Secure user authentication using JSON Web Tokens (JWT) for stateless session handling.
-   **Authentication Middleware:** Protects sensitive routes and ensures secure access to user-specific resources.

### **Core Functionality**

-   **Book Search API:** Real-time integration with Google Books API, providing access to millions of books with comprehensive metadata.
-   **User Library Management:** Personal book collections with custom shelves and reading status tracking.
-   **Book Management:** Full CRUD operations for user's personal book collections and reading lists.
-   **Shelf System:** Organized book categorization with customizable shelves for enhanced library management.

### **Database & Data Management**

-   **Complex Database Architecture:** Sophisticated PostgreSQL database design with over a dozen interconnected tables managing users, books, shelves, and relationships.
-   **Real-time Data Synchronization:** Seamless integration between local database and external Google Books API data.

### **System & Error Handling**

-   **Centralized Error Management:** A robust middleware system gracefully handles both expected and unexpected application errors, ensuring standardized error responses.
-   **Strict Data Validation:** Implementation of Zod for rigorous validation and sanitization on all incoming client data to prevent common vulnerabilities and ensure data integrity.

---

## System Architecture & Technology

The backend is built on a modern, robust technology stack, architected for scalability and maintainability.

| Category       | Technology / Tool                           |
| -------------- | ------------------------------------------- |
| **Core**       | JavaScript, Node.js, Express.js, TypeScript |
| **Database**   | PostgreSQL                                  |
| **Security**   | jsonwebtoken, Zod                           |
| **Tooling**    | Git, npm                                    |
| **Deployment** | Docker                                      |

The application follows a layered architecture, separating concerns into distinct modules:

-   **Routes:** Define the API endpoints and handle HTTP routing.
-   **Controllers:** Handle incoming requests and outgoing responses.
-   **Services:** Contain the core business logic and external API integrations.
-   **Models/Data Access Layer:** Manage all interactions with the PostgreSQL database and data transformations.

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

    _Ensure you have a local PostgreSQL instance running and have created the `volumen_db` database._

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## Deployment on Railway

**Work in progress** - Deployment configuration and instructions will be added upon completion of the production setup.

---

## Project Retrospective & Key Learnings

**Work in progress** - This section will be completed with detailed insights and challenges overcome during the development process, including:

- Complex database design considerations
- Google Books API integration strategies
- TypeScript migration benefits
- Zod validation implementation
- Docker containerization approach

---

## Conclusion

**Work in progress** - A comprehensive summary of the project's impact on backend development skills and architectural understanding will be provided here, focusing on the unique challenges of building a book management system with real-time external API integration.