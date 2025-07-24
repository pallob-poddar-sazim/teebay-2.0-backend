#!/bin/bash
set -e

BUCKET_NAME=product-bucket

awslocal s3api create-bucket --bucket $BUCKET_NAME

echo "Product bucket has been created"

awslocal s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
      "AllowedHeaders": ["*"]
    }
  ]
}'