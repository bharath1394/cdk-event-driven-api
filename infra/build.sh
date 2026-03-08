#!/bin/bash

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAMBDA_BASE="$SCRIPT_DIR/service/lambda-functions"

echo "Building api-handler..."
cd "$LAMBDA_BASE/api-handler"
npm install && npm run build

echo "Building consumer1..."
cd "$LAMBDA_BASE/consumer1"
npm install && npm run build

echo "Building consumer2..."
cd "$LAMBDA_BASE/consumer2"
npm install && npm run build

echo "Building CDK stack..."
cd "$SCRIPT_DIR"
npm run build

echo ""
echo "=========================================="
echo "Checking for infrastructure changes..."
echo "=========================================="
cdk diff

echo ""
echo "=========================================="
read -p "Do you want to deploy these changes? (yes/no): " approval

if [ "$approval" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

echo "Deploying to AWS..."
cdk deploy --require-approval never


echo "✓ All builds and deployment completed successfully!"