#!/bin/bash

# Set your AWS region
AWS_REGION="us-east-1"

echo "Creating DynamoDB tables..."

# Create Bookings table
aws dynamodb create-table \
    --table-name markham-restring-bookings \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $AWS_REGION

# Create Strings table
aws dynamodb create-table \
    --table-name markham-restring-strings \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $AWS_REGION

# Create Availability table
aws dynamodb create-table \
    --table-name markham-restring-availability \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $AWS_REGION

echo "Tables created successfully!"
echo "Waiting for tables to be active..."

# Wait for tables to be active
aws dynamodb wait table-exists \
    --table-name markham-restring-bookings \
    --region $AWS_REGION

aws dynamodb wait table-exists \
    --table-name markham-restring-strings \
    --region $AWS_REGION

aws dynamodb wait table-exists \
    --table-name markham-restring-availability \
    --region $AWS_REGION

echo "All tables are now active!" 