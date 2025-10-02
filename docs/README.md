# AI-Powered Portfolio Website

## 1. Overview

This project provides a complete, production-ready system for an AI-powered portfolio website. It allows visitors to chat with an AI assistant that answers questions based on the portfolio owner's documents (e.g., resume, project descriptions). The entire system is designed to be deployed on Google Cloud Platform, with a strong emphasis on cost-optimization through serverless, scale-to-zero architecture.

The core of the project is a **Retrieval-Augmented Generation (RAG)** pipeline. When a user asks a question, the system:
1.  Converts the user's query into a vector embedding.
2.  Performs a semantic search against a vector database of pre-processed document chunks.
3.  Retrieves the most relevant chunks of text.
4.  Feeds these chunks, along with the original query, into a Large Language Model (LLM) to generate a context-aware answer.

## 2. Architecture

The system is composed of containerized microservices deployed on Google Cloud.

```
+-----------------+      +---------------------+      +------------------------+
|   Static        |      |   FastAPI Backend   |      |   Google Vertex AI     |
|   Frontend      |----->| (Google Cloud Run)  |----->|     (Gemini Pro)       |
| (GitHub Pages)  |      +---------------------+      +------------------------+
+-----------------+      |          ^          |
                         |          |          |
                         |          v          |
                  +------------------+  +---------------------+
                  | Google Firestore |  | Google Cloud Storage|
                  | (Vector Store)   |  | (PDF Documents)     |
                  +------------------+  +---------------------+
```

-   **Frontend**: A static HTML, CSS, and JavaScript single-page application. It can be hosted for free on platforms like GitHub Pages, Netlify, or Vercel.
-   **Backend**: A FastAPI application running in a Docker container on **Google Cloud Run**. This provides automatic scaling, including scaling down to zero instances to eliminate costs when not in use.
-   **AI/ML Stack**:
    -   **LLM**: **Google Vertex AI (Gemini Pro)** is used for generating intelligent, human-like responses.
    -   **Embeddings**: The `sentence-transformers` library runs within the backend container to generate vector embeddings for documents and queries.
-   **Database**: **Google Firestore** in Native Mode acts as a cost-effective vector database, storing text chunks and their corresponding embeddings.
-   **Storage**: **Google Cloud Storage** is used to store the original PDF documents uploaded by the portfolio owner.

## 3. Features

-   **AI Chat**: Real-time chat interface for visitors to interact with an AI agent.
-   **RAG Architecture**: Provides accurate, context-based answers from your personal documents.
-   **Serverless & Scalable**: Built on Cloud Run and Firestore for automatic scaling and cost efficiency.
-   **CI/CD**: Automated deployment pipeline using Google Cloud Build.
-   **Secure**: API key authentication for management endpoints.
-   **Cost-Optimized**: Designed to run for **<$5/month** for moderate traffic by leveraging free tiers and scale-to-zero services.

## 4. Prerequisites

-   Google Cloud SDK (gcloud CLI) installed and authenticated.
-   Docker installed and running.
-   A Google Cloud project with billing enabled.
-   `gsutil` command-line tool (usually comes with gcloud SDK).
-   `openssl` for generating the API key (usually pre-installed on Linux/macOS).

## 5. Step-by-Step Setup & Deployment

A detailed guide is available in DEPLOYMENT.md. The short version is:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd portfolio-ai
    ```

2.  **Run the GCP Setup Script:**
    This script will configure your GCP project, enable APIs, create a service account, and set up storage and database services.
    ```bash
    chmod +x deployment/setup-gcp.sh
    ./deployment/setup-gcp.sh
    ```
    Follow the prompts. It will ask for your GCP Project ID and generate a `.env` file in the `backend/` directory containing your configuration and a new API key.

3.  **Add Your Documents:**
    Place your resume, portfolio, or any other PDF documents you want the AI to learn from into the `sample-data/sample-documents/` directory.

4.  **Deploy the Backend:**
    This script triggers a Cloud Build job that will containerize and deploy your FastAPI backend to Cloud Run.
    ```bash
    chmod +x deployment/deploy.sh
    ./deployment/deploy.sh
    ```

5.  **Get Your Deployed API URL:**
    After the deployment finishes, find your Cloud Run service URL:
    ```bash
    gcloud run services describe portfolio-ai-backend --platform managed --region us-central1 --format 'value(status.url)'
    ```

6.  **Configure the Frontend:**
    -   Open `frontend/script.js`.
    -   Replace `YOUR_CLOUD_RUN_API_URL_HERE` with the URL from the previous step.
    -   Replace `YOUR_API_KEY_HERE` with the API key found in `backend/.env`.

7.  **Upload Your Documents to the AI:**
    Use a tool like `curl` or Postman to upload each document from `sample-data/sample-documents/` to your running service.
    ```bash
    API_URL="YOUR_CLOUD_RUN_URL_FROM_STEP_5"
    API_KEY="YOUR_API_KEY_FROM_DOTENV"
    FILE_PATH="sample-data/sample-documents/your_resume.pdf"

    curl -X POST "${API_URL}/upload-document" \
         -H "X-API-Key: ${API_KEY}" \
         -F "file=@${FILE_PATH}"
    ```

8.  **Deploy the Frontend:**
    Host the `frontend` directory on any static site hosting provider (GitHub Pages, Netlify, etc.).

## 6. Cost Breakdown

This architecture is heavily optimized for low cost.

| Service                | Free Tier (Monthly)                               | Cost Beyond Free Tier (us-central1)                | Estimated Monthly Cost (Moderate Use) |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| **Cloud Run**          | 2 million requests, 360,000 vCPU-sec, 360,000 GiB-sec | ~$0.40 per million requests                        | ~$0.50 - $2.00                        |
| **Firestore**          | 1 GiB storage, 50k reads, 20k writes, 20k deletes | ~$0.18/GiB storage, ~$0.06/100k reads             | ~$0.10 - $0.50                        |
| **Cloud Storage**      | 5 GB-months (Standard), 5k Class A ops, 50k Class B ops | ~$0.02/GB-month                                    | <$0.01                                |
| **Vertex AI Gemini**   | No free tier for API calls                        | ~$0.00025 / 1k input chars, ~$0.0005 / 1k output chars | ~$1.00 - $2.50 (for 1000 queries)     |
| **Artifact Registry**  | 0.5 GB storage                                    | ~$0.10/GB-month                                    | ~$0.05                                |
| **Cloud Build**        | 120 build-minutes/day                             | ~$0.003/build-minute                               | $0 (covered by free tier)             |
| **Total Estimated**    |                                                   |                                                    | **$1.65 - $5.05**                     |

**Note**: The `sentence-transformers` model loading can be slow on the first request (cold start). Cloud Run's `--min-instances=1` setting can eliminate this but will incur costs for keeping one instance running (~$15-20/month for a 1vCPU/1GiB instance). For a portfolio, scale-to-zero is the most cost-effective approach.

## 7. Troubleshooting

-   **500 Internal Server Error**: Check the Cloud Run logs for your service in the GCP console. This is often due to missing permissions for the service account or incorrect environment variables.
-   **403 Forbidden Error**: Ensure your `X-API-Key` header is correct.
-   **Cold Starts**: The first request after a period of inactivity may be slow (30-60 seconds) as Cloud Run starts a new container and the embedding model is loaded into memory. This is expected with a scale-to-zero configuration.
-   **Quota Errors**: If deployment fails with a quota error, you may need to request a quota increase for resources like "CPUs" in your target region via the GCP IAM & Admin console.

## 8. Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.
