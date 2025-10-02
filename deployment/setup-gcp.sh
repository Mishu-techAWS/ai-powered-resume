#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Prompt user for GCP Project ID
read -p "Enter your GCP Project ID: " GCP_PROJECT_ID

# Set other variables
GCP_REGION="us-central1"
SERVICE_NAME="portfolio-ai-backend"
GCS_BUCKET_NAME="${GCP_PROJECT_ID}-portfolio-docs"
FIRESTORE_COLLECTION="portfolio_documents"
SERVICE_ACCOUNT_NAME="portfolio-ai-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

echo "--- Using the following configuration ---"
echo "Project ID:         $GCP_PROJECT_ID"
echo "Region:             $GCP_REGION"
echo "Service Name:       $SERVICE_NAME"
echo "GCS Bucket:         $GCS_BUCKET_NAME"
echo "Firestore Collection: $FIRESTORE_COLLECTION"
echo "Service Account:    $SERVICE_ACCOUNT_NAME"
echo "-----------------------------------------"
read -p "Press Enter to continue or Ctrl+C to exit..."

# --- Setup GCP Project and Services ---
echo "1. Setting GCP project..."
gcloud config set project $GCP_PROJECT_ID

echo "2. Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  storage.googleapis.com \
  firestore.googleapis.com \
  aiplatform.googleapis.com \
  artifactregistry.googleapis.com

# --- Create Service Account ---
echo "3. Creating Service Account..."
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="Portfolio AI Service Account" || echo "Service account already exists."

echo "4. Granting roles to Service Account..."
# Role for Cloud Run Invoker (if you want to restrict access)
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.invoker"

# Role for accessing Firestore
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/datastore.user"

# Role for accessing Cloud Storage
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectAdmin"

# Role for accessing Vertex AI
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/aiplatform.user"

# --- Create GCS Bucket ---
echo "5. Creating Google Cloud Storage bucket..."
gsutil mb -p $GCP_PROJECT_ID -l $GCP_REGION gs://${GCS_BUCKET_NAME} || echo "Bucket already exists."

# --- Create Firestore Database ---
echo "6. Creating Firestore database in Native mode..."
gcloud firestore databases create --location=$GCP_REGION --type=firestore-native || echo "Firestore database already exists."

# --- Generate API Key ---
echo "7. Generating a secure API Key..."
API_KEY=$(openssl rand -base64 32)

# --- Create .env file ---
echo "8. Creating .env file for local development and deployment..."
cat > backend/.env << EOL
GCP_PROJECT_ID=${GCP_PROJECT_ID}
GCP_REGION=${GCP_REGION}
GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
FIRESTORE_COLLECTION=${FIRESTORE_COLLECTION}
API_KEY=${API_KEY}
EOL

echo "--- GCP Setup Complete! ---"
echo ""
echo "IMPORTANT: Your generated API Key is: ${API_KEY}"
echo "This has been saved to backend/.env"
echo "You will also need to add this key and your Cloud Run URL to frontend/script.js after deployment."
echo ""
echo "Next steps:"
echo "1. Place your resume or other documents in the 'sample-data/sample-documents/' directory."
echo "2. Run the deployment script: ./deployment/deploy.sh"

