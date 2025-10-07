# GitHub Actions Setup Instructions

## Required GitHub Secrets

Add these 3 secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### 1. Create Service Account in GCP Console

1. Go to GCP Console → IAM & Admin → Service Accounts
2. Create a new service account named `github-actions-sa`
3. Grant the following roles:
   - Cloud Run Admin
   - Storage Admin  
   - Artifact Registry Administrator
   - Service Account User
   - Project IAM Admin
   - Service Usage Admin
   - Firestore Service Agent

### 2. Add Required Secrets

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Contents of the JSON key file (entire JSON as text)
- `API_URL`: https://portfolio-ai-backend-897296490174.us-central1.run.app

### 3. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The workflow will automatically deploy frontend to GitHub Pages

### 4. Smart Deployment Features

- **Change Detection**: Only rebuilds backend/frontend when files change
- **Conditional Deployment**: Frontend deploys after successful backend deployment
- **Automatic API URL**: Updates frontend with your API URL from secrets

The workflow automatically handles all GCP resource creation and deploys both backend and frontend.
