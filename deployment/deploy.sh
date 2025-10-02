#!/bin/bash

set -e

# Check if gcloud is configured with a project
GCP_PROJECT_ID=$(gcloud config get-value project)
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "GCP project not set."
    echo "Please run 'gcloud config set project YOUR_PROJECT_ID' or run the setup script first."
    exit 1
fi

echo "Deploying to project: $GCP_PROJECT_ID"

# Create an Artifact Registry repository if it doesn't exist
SERVICE_NAME="portfolio-ai-backend"
GCP_REGION="us-central1"
gcloud artifacts repositories create $SERVICE_NAME \
    --repository-format=docker \
    --location=$GCP_REGION \
    --description="Docker repository for AI Portfolio" || echo "Artifact Registry repo already exists."

# Submit the build to Google Cloud Build
echo "Submitting build to Google Cloud Build..."
gcloud builds submit --config=deployment/cloudbuild.yaml .

echo "--- Deployment Triggered ---"
echo "Monitor the build progress in the Google Cloud Console:"
echo "https://console.cloud.google.com/cloud-build/builds?project=${GCP_PROJECT_ID}"
echo ""
echo "After deployment, get your service URL with:"
echo "gcloud run services describe ${SERVICE_NAME} --platform managed --region ${GCP_REGION} --format 'value(status.url)'"
