#!/bin/bash

# Upload CV to your deployed backend
# Usage: ./upload_cv.sh path/to/your/cv.pdf

if [ $# -eq 0 ]; then
    echo "Usage: $0 <path_to_cv.pdf>"
    echo "Example: $0 ~/Documents/my_cv.pdf"
    exit 1
fi

CV_FILE="$1"
API_URL="https://portfolio-ai-backend-897296490174.us-central1.run.app"

if [ ! -f "$CV_FILE" ]; then
    echo "Error: File '$CV_FILE' not found!"
    exit 1
fi

echo "Uploading CV: $CV_FILE"
echo "To API: $API_URL/upload-document"

curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$CV_FILE" \
  "$API_URL/upload-document"

echo -e "\n\nUpload completed!"
