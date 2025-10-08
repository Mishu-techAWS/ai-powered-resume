#!/usr/bin/env python3
import requests
import sys
import os

def upload_cv(file_path):
    """Upload CV to the backend API"""
    
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found!")
        return False
    
    if not file_path.lower().endswith('.pdf'):
        print("Error: Only PDF files are supported!")
        return False
    
    api_url = "https://portfolio-ai-backend-897296490174.us-central1.run.app/upload-document"
    
    print(f"Uploading: {file_path}")
    print(f"To: {api_url}")
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': (os.path.basename(file_path), file, 'application/pdf')}
            response = requests.post(api_url, files=files)
        
        if response.status_code == 201:
            print("✅ Upload successful!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Upload failed with status {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Upload failed: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 upload_cv.py <path_to_cv.pdf>")
        print("Example: python3 upload_cv.py ~/Documents/my_cv.pdf")
        sys.exit(1)
    
    cv_path = sys.argv[1]
    upload_cv(cv_path)
