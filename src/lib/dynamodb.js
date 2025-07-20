import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let clientConfig = { region: process.env.AWS_REGION };

if (process.env.AWS_ROLE_ARN && process.env.VERCEL) {
  // Use OIDC credentials on Vercel
  const { awsCredentialsProvider } = require('@vercel/functions/oidc');
  clientConfig.credentials = awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN,
  });
} else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  // Use static credentials locally
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const ddbClient = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(ddbClient);

export function generateId() {
  return (
    'id_' +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
  );
}
