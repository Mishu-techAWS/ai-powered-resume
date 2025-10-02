# Deployment Guide

This guide provides detailed, step-by-step instructions to deploy the AI-Powered Portfolio website on Google Cloud Platform.

## Prerequisites

1.  **GCP Account**: A Google Cloud Platform account with billing enabled.
2.  **GCP Project**: A new or existing GCP project.
3.  **gcloud CLI**: The Google Cloud SDK installed and authenticated (`gcloud auth login`).
4.  **Docker**: Docker Desktop installed and running on your local machine.
5.  **Git**: The project code cloned to your local machine.

---

## Step 1: Initial GCP Setup (Automated)

The `setup-gcp.sh` script automates most of the initial configuration.

1.  **Navigate to the project root directory.**

2.  **Make the script executable:**
    ```bash
    chmod +x deployment/setup-gcp.sh
    ```

3.  **Run the script:**
    ```bash
    ./deployment/setup-gcp.sh
    ```

4.  **Follow the prompts:**
    -   You will be asked to enter your **GCP Project ID**.
    -   The script will then perform the following actions:
        -   Set the active gcloud project.
        -   Enable all required APIs (Cloud Run, Cloud Build, Firestore, etc.).
        -   Create a dedicated Service Account (`portfolio-ai-sa`).
        -   Grant the necessary IAM roles to the service account.
        -   Create a Google Cloud Storage bucket for your documents.
        -   Initialize a Firestore database in Native Mode.
        -   Generate a secure API key.
        -   Create a `backend/.env` file with all the necessary environment variables.

5.  **Verify the `.env` file:**
    After the script completes, check that `backend/.env` has been created and populated. **Take note of the `API_KEY`**, as you will need it for the frontend and for uploading documents.

---

## Step 2: Deploy the Backend to Cloud Run

The `deploy.sh` script uses Google Cloud Build to containerize and deploy the backend application.

1.  **Make the script executable:**
    ```bash
    chmod +x deployment/deploy.sh
    ```

2.  **Run the deployment script:**
    ```bash
    ./deployment/deploy.sh
    ```
    This command submits your code to Cloud Build. Cloud Build will:
    -   Read the `deployment/cloudbuild.yaml` configuration.
    -   Build the Docker image using `backend/Dockerfile`.
    -   Push the image to Google Artifact Registry.
    -   Deploy the new image to your Cloud Run service.

3.  **Monitor the Deployment:**
    You can watch the build progress in the GCP Console under `Cloud Build > History`. The first deployment may take 5-10 minutes.

---

## Step 3: Upload Your Documents

Once the backend is deployed, you need to provide it with the documents for the RAG system.

1.  **Get Your Service URL:**
    Run the following command to get the URL of your deployed service:
    ```bash
    gcloud run services describe portfolio-ai-backend --platform managed --region us-central1 --format 'value(status.url)'
    ```
    Copy this URL.

2.  **Place your PDFs** in the `sample-data/sample-documents/` directory. For this example, let's assume you have a file named `resume.pdf`.

3.  **Upload the Document:**
    Use a tool like `curl` to call the `/upload-document` endpoint. Replace the placeholder values with your actual service URL and API key (from `backend/.env`).

    ```bash
    # Replace with your actual values
    API_URL="YOUR_CLOUD_RUN_URL"
    API_KEY="YOUR_API_KEY"
    FILE_PATH="sample-data/sample-documents/resume.pdf"

    curl -X POST "${API_URL}/upload-document" \
         -H "X-API-Key: ${API_KEY}" \
         -F "file=@${FILE_PATH}"
    ```
    You should receive a success message. Repeat this for any other documents.

---

## Step 4: Configure and Deploy the Frontend

The frontend is a static site and can be hosted anywhere.

1.  **Configure API Connection:**
    -   Open the `frontend/script.js` file.
    -   Find the following lines at the top:
        ```javascript
        const API_URL = 'YOUR_CLOUD_RUN_API_URL_HERE';
        const API_KEY = 'YOUR_API_KEY_HERE';
        ```
    -   Replace `YOUR_CLOUD_RUN_API_URL_HERE` with the URL you retrieved in Step 3.
    -   Replace `YOUR_API_KEY_HERE` with the API key from your `backend/.env` file.

2.  **Deploy the Frontend:**
    You have several free options:
    -   **GitHub Pages**: Create a new repository, push the `frontend` folder's contents, and enable GitHub Pages in the repository settings.
    -   **Netlify**: Drag and drop the `frontend` folder onto the Netlify dashboard.
    -   **Vercel**: Similar to Netlify, easily deploy the static site.

    Once deployed, your AI-powered portfolio is live!

---

## Step 5: Monitoring and Security

-   **Logging**: View logs for your backend service in the GCP Console under `Cloud Run > [your-service] > Logs`.
-   **Monitoring**: Cloud Run provides built-in monitoring for request count, latency, and errors.
-   **Security**:
    -   The `/chat` endpoint is public, but the `/upload-document` endpoint is protected by the `X-API-Key` header. Keep your API key secret.
    -   For a production website, you should restrict the CORS `allow_origins` in `backend/main.py` to your frontend's specific domain instead of `["*"]`.
    -   Consider placing your Cloud Run service behind a Load Balancer with Cloud Armor for WAF and DDoS protection if you anticipate high traffic.
