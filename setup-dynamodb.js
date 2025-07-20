const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const tables = [
  {
    TableName: 'markham-restring-bookings',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'markham-restring-strings',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'markham-restring-availability',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function createTables() {
  for (const tableConfig of tables) {
    try {
      console.log(`Creating table: ${tableConfig.TableName}`);
      const command = new CreateTableCommand(tableConfig);
      await client.send(command);
      console.log(`✅ Table ${tableConfig.TableName} created successfully`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`⚠️  Table ${tableConfig.TableName} already exists`);
      } else {
        console.error(`❌ Error creating table ${tableConfig.TableName}:`, error.message);
      }
    }
  }
}

createTables().catch(console.error); 