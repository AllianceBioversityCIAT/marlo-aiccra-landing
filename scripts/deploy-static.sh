#!/usr/bin/env bash
# Legacy deploy: static assets to S3 + CloudFront invalidation (rollback mode).
# Requires: AWS CLI, output from `npm run build:static`
#
# Env vars:
#   S3_BUCKET                  (required)
#   CLOUDFRONT_DISTRIBUTION_ID (optional)
#   AWS_REGION                 (optional, default us-east-1)

set -euo pipefail

S3_BUCKET="${S3_BUCKET:?S3_BUCKET is required}"
AWS_REGION="${AWS_REGION:-us-east-1}"

if [ -d "dist/client" ]; then
  ASSET_DIR="dist/client"
elif [ -d "dist" ]; then
  ASSET_DIR="dist"
else
  echo "No build output found. Run: npm run build:static"
  exit 1
fi

echo "Syncing ${ASSET_DIR}/ to s3://${S3_BUCKET}/"
aws s3 sync "${ASSET_DIR}/" "s3://${S3_BUCKET}/" --delete --region "${AWS_REGION}"

if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Invalidating CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths '/*'
fi

echo "Static S3 deploy complete."
