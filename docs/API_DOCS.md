# API Documentation

This document describes the API endpoints for the AI Portfolio Assistant backend.

**Base URL**: The base URL is your deployed Google Cloud Run service URL (e.g., `https://portfolio-ai-backend-xxxxxxxx-uc.a.run.app`).

---

## Authentication

Endpoints tagged with `Document Management` require an API key for authentication. The key must be passed in the `X-API-Key` header.

**Header:**
`X-API-Key: YOUR_SECRET_API_KEY`

---

## Endpoints

### 1. Health Check

-   **Endpoint**: `GET /health`
-   **Description**: A simple health check endpoint to verify that the API is running.
-   **Tags**: `Monitoring`
-   **Authentication**: None
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "ok"
    }
    ```

### 2. Chat with AI Assistant

-   **Endpoint**: `POST /chat`
-   **Description**: The main endpoint for interacting with the AI agent. It takes a user's query, performs a semantic search on the stored documents, and generates a response using the LLM.
-   **Tags**: `AI Chat`
-   **Authentication**: Public (No API key needed for chat functionality).
-   **Request Body**:
    ```json
    {
      "query": "What are John Doe's key skills in backend development?",
      "session_id": "optional-session-id-123"
    }
    ```
    -   `query` (string, required): The user's question.
    -   `session_id` (string, optional): A unique string to identify a conversation session (currently not used for context memory but can be implemented).

-   **Success Response (200 OK)**:
    ```json
    {
      "answer": "John Doe has extensive experience in backend development with Python, particularly using frameworks like FastAPI and Django. He is also skilled in database management with PostgreSQL and Firestore, and has deployed applications on Google Cloud Run.",
      "source_chunks": [
        "Relevant text chunk 1 from the resume...",
        "Relevant text chunk 2 from a project description..."
      ]
    }
    ```

-   **Error Response (404 Not Found)**:
    Returned if no relevant information is found in the vector store.
    ```json
    {
      "detail": "I don't have enough information to answer that question."
    }
    ```

### 3. Upload Document

-   **Endpoint**: `POST /upload-document`
-   **Description**: Uploads a new PDF document to the system. The document is processed into chunks, embedded, and stored in the vector database. If a document with the same filename already exists, its old chunks are deleted and replaced.
-   **Tags**: `Document Management`
-   **Authentication**: **API Key Required**.
-   **Request Body**: `multipart/form-data`
    -   `file`: The PDF file to be uploaded.

-   **Example `curl` command:**
    ```bash
    curl -X POST "YOUR_BASE_URL/upload-document" \
         -H "X-API-Key: YOUR_SECRET_API_KEY" \
         -F "file=@/path/to/your/resume.pdf"
    ```

-   **Success Response (201 Created)**:
    ```json
    {
      "message": "Document 'resume.pdf' processed and stored successfully."
    }
    ```

-   **Error Responses**:
    -   **400 Bad Request**: If the file is not a PDF or if no content can be extracted.
    -   **403 Forbidden**: If the API key is missing or invalid.
    -   **500 Internal Server Error**: If an unexpected error occurs during processing.
