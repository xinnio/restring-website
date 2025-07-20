import { docClient, getAvailabilityTable, generateId } from '../../../lib/dynamodb';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export default async function handler(req, res) {
  try {
    const tableName = await getAvailabilityTable();

    if (req.method === 'GET') {
      const scanCommand = new ScanCommand({
        TableName: tableName,
      });
      
      const result = await docClient.send(scanCommand);
      const availability = result.Items || [];
      
      // Sort by slot
      availability.sort((a, b) => (a.slot || '').localeCompare(b.slot || ''));
      
      res.status(200).json(availability);
    } else if (req.method === 'POST') {
      const id = await generateId();
      
      const slot = {
        id,
        ...req.body,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const putCommand = new PutCommand({
        TableName: tableName,
        Item: slot,
      });
      
      await docClient.send(putCommand);
      res.status(201).json({ message: 'Availability slot added!', id: id });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
} 