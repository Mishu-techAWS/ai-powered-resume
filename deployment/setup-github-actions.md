# GitHub Actions Setup Instructions

## Automated Setup

The GitHub Actions workflow now automatically creates all GCP resources including buckets, Firestore database, service accounts, and API keys.

## Required GitHub Secrets

You only need to create a GitHub Actions service account and add these 2 secrets:

### 1. Create Service Account in GCP Console

1. Go to GCP Console → IAM & Admin → Service Accounts
2. Create a new service account named `github-actions-sa`
3. Grant the following roles:
   - Cloud Run Admin
   - Storage Admin  
   - Artifact Registry Administrator
   - Service Account User
   - Project IAM Admin (to create other service accounts)
   - Service Usage Admin (to enable APIs)
   - Firestore Service Agent

### 2. Generate Service Account Key

1. Click on the created service account
2. Go to Keys tab → Add Key → Create new key (JSON)
3. Download the JSON key file

### 3. Add GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these 2 secrets:

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Contents of the JSON key file (entire JSON as text)

### 4. What Gets Created Automatically

The workflow will automatically:
- Enable all required GCP APIs
- Create Cloud Storage bucket: `{PROJECT_ID}-portfolio-docs`
- Create Firestore database in native mode
- Create application service account: `portfolio-ai-sa`
- Grant necessary IAM roles
- Generate .env file with all configurations
- Deploy the application to Cloud Run

The deployment triggers automatically on pushes to the main branch.
