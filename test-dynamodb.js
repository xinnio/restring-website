import { docClient, getBookingsTable } from './src/lib/dynamodb.js';

async function testDynamoDB() {
  try {
    console.log('Testing DynamoDB connection...');
    
    const tableName = await getBookingsTable();
    console.log('Table name:', tableName);
    
    // Test a simple scan operation
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    const scanCommand = new ScanCommand({
      TableName: tableName,
      Limit: 1
    });
    
    const result = await docClient.send(scanCommand);
    console.log('✅ DynamoDB connection successful!');
    console.log('Items found:', result.Items?.length || 0);
    
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error);
  }
}

testDynamoDB(); 