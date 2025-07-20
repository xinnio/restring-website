# AWS DynamoDB Migration Guide

This guide will help you migrate from MongoDB to AWS DynamoDB for your Markham Restring Studio application.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI
3. **IAM User**: Create an IAM user with DynamoDB permissions

## Step 1: Create IAM User and Permissions

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policy (or create a custom one):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/markham-restring-*"
            ]
        }
    ]
}
```

## Step 2: Set Environment Variables

Add these environment variables to your `.env.local` file:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
DYNAMODB_BOOKINGS_TABLE=markham-restring-bookings
DYNAMODB_STRINGS_TABLE=markham-restring-strings
DYNAMODB_AVAILABILITY_TABLE=markham-restring-availability
```

## Step 3: Create DynamoDB Tables

Run the setup script to create the required tables:

```bash
node setup-dynamodb.js
```

This will create three tables:
- `markham-restring-bookings`
- `markham-restring-strings`
- `markham-restring-availability`

## Step 4: Deploy to Production

For Vercel deployment, add the environment variables in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add all the AWS environment variables listed above

## Step 5: Test the Migration

1. Start your development server: `npm run dev`
2. Test the API endpoints:
   - `/api/bookings` (GET/POST)
   - `/api/strings` (GET/POST)
   - `/api/availability` (GET/POST/DELETE)

## Data Migration (Optional)

If you have existing data in MongoDB that you want to migrate:

1. Export your MongoDB data
2. Use the `/api/seed` endpoint to populate DynamoDB with sample data
3. Or create a custom migration script

## Cost Optimization

DynamoDB uses pay-per-request billing by default, which is cost-effective for low-traffic applications. For higher traffic, consider:

1. **On-Demand Billing**: Good for unpredictable traffic
2. **Provisioned Billing**: Better for predictable, high-traffic applications

## Monitoring

Monitor your DynamoDB usage in the AWS Console:
1. Go to DynamoDB Console
2. Check the "Metrics" tab for each table
3. Monitor read/write capacity and throttling

## Troubleshooting

### Common Issues:

1. **Access Denied**: Check IAM permissions
2. **Table Not Found**: Ensure tables are created in the correct region
3. **Environment Variables**: Verify all AWS credentials are set correctly

### Error Messages:

- `ResourceNotFoundException`: Table doesn't exist
- `AccessDeniedException`: IAM permissions issue
- `ValidationException`: Invalid request parameters

## Security Best Practices

1. **Use IAM Roles** instead of access keys when possible
2. **Rotate Access Keys** regularly
3. **Use VPC Endpoints** for enhanced security
4. **Enable CloudTrail** for audit logging

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify environment variables
3. Test with AWS CLI commands
4. Review DynamoDB documentation 