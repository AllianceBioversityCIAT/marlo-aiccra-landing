#!/usr/bin/env bash
# Deploy SSR bundle to AWS Lambda (no S3 upload).
# Requires: AWS CLI, dist/lambda and dist/client from `npm run build:lambda`
#
# Env vars:
#   LAMBDA_FUNCTION_NAME   (required)
#   CLOUDFRONT_DISTRIBUTION_ID (optional, triggers invalidation)
#   AWS_REGION             (optional, default us-east-1)

set -euo pipefail

LAMBDA_FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:?LAMBDA_FUNCTION_NAME is required}"
AWS_REGION="${AWS_REGION:-us-east-1}"

if [ ! -d "dist/lambda" ]; then
  echo "dist/lambda not found. Run: npm run build:lambda"
  exit 1
fi

if [ ! -d "dist/client" ]; then
  echo "dist/client not found. Run: npm run build:lambda"
  exit 1
fi

echo "Packaging Lambda (SSR + static assets, no S3 upload)..."
rm -rf dist/.lambda-package dist/function.zip
mkdir -p dist/.lambda-package

cp -r dist/lambda/. dist/.lambda-package/
cp -r dist/client dist/.lambda-package/client

(cd dist/.lambda-package && zip -qr ../function.zip .)

echo "Updating Lambda function: ${LAMBDA_FUNCTION_NAME}"
aws lambda update-function-code \
  --region "${AWS_REGION}" \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --zip-file fileb://dist/function.zip

aws lambda wait function-updated \
  --region "${AWS_REGION}" \
  --function-name "${LAMBDA_FUNCTION_NAME}"

if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Invalidating CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths '/*'
fi

echo "Lambda deploy complete."
