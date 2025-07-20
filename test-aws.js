const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testConnection() {
  try {
    console.log('Testing AWS DynamoDB connection...');
    console.log('Region:', process.env.AWS_REGION || 'us-east-1');
    console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
    console.log('Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
    
    const command = new ListTablesCommand({});
    const result = await client.send(command);
    
    console.log('✅ Connection successful!');
    console.log('Tables found:', result.TableNames);
    
    // Check for our specific tables
    const expectedTables = [
      'markham-restring-bookings',
      'markham-restring-strings', 
      'markham-restring-availability'
    ];
    
    for (const table of expectedTables) {
      if (result.TableNames.includes(table)) {
        console.log(`✅ Table "${table}" exists`);
      } else {
        console.log(`❌ Table "${table}" not found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection(); 