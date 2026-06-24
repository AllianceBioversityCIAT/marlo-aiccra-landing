#!/usr/bin/env bash
# Build Docker image, push to ECR, and update Lambda (container image).
#
# Required env vars:
#   ECR_REGISTRY           e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com
#   ECR_REPO               e.g. marlo-landing
#   LAMBDA_FUNCTION_NAME
#
# Optional:
#   IMAGE_TAG              defaults to BUILD_NUMBER or latest
#   AWS_REGION             defaults to us-east-1
#   CLOUDFRONT_DISTRIBUTION_ID

set -euo pipefail

ECR_REGISTRY="${ECR_REGISTRY:?ECR_REGISTRY is required}"
ECR_REPO="${ECR_REPO:?ECR_REPO is required}"
LAMBDA_FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:?LAMBDA_FUNCTION_NAME is required}"
AWS_REGION="${AWS_REGION:-us-east-1}"
IMAGE_TAG="${IMAGE_TAG:-${BUILD_NUMBER:-latest}}"

IMAGE_URI="${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"

echo "Building image: ${IMAGE_URI}"
docker build -t "${IMAGE_URI}" .

echo "Logging in to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${ECR_REGISTRY}"

echo "Pushing image..."
docker push "${IMAGE_URI}"

echo "Updating Lambda function: ${LAMBDA_FUNCTION_NAME}"
aws lambda update-function-code \
  --region "${AWS_REGION}" \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --image-uri "${IMAGE_URI}"

aws lambda wait function-updated-v2 \
  --region "${AWS_REGION}" \
  --function-name "${LAMBDA_FUNCTION_NAME}"

if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Invalidating CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths '/*'
fi

echo "Deploy complete: ${IMAGE_URI}"
