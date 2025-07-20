import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Check if AWS credentials are available
const hasCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(hasCredentials && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

// Create document client for easier operations
const docClient = DynamoDBDocumentClient.from(client);

// Table names
export const TABLES = {
  BOOKINGS: process.env.DYNAMODB_BOOKINGS_TABLE || 'markham-restring-bookings',
  STRINGS: process.env.DYNAMODB_STRINGS_TABLE || 'markham-restring-strings',
  AVAILABILITY: process.env.DYNAMODB_AVAILABILITY_TABLE || 'markham-restring-availability',
  NOTICES: process.env.DYNAMODB_NOTICES_TABLE || 'markham-restring-notices',
};

export { docClient };
export default docClient;

// Helper functions for each collection
export async function getBookingsTable() {
  return TABLES.BOOKINGS;
}

export async function getStringsTable() {
  return TABLES.STRINGS;
}

export async function getAvailabilityTable() {
  return TABLES.AVAILABILITY;
}

export async function getNoticesTable() {
  return TABLES.NOTICES;
}

// Utility functions for common operations
export async function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export async function generateBookingNumber() {
  // This will be implemented in the bookings API
  return Date.now();
} 