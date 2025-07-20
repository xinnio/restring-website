import { docClient, getAvailabilityTable, generateId } from '../../../lib/dynamodb';
import { PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tableName = await getAvailabilityTable();
    
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });
    
    const result = await docClient.send(scanCommand);
    const availability = result.Items || [];
    
    // Sort by slot
    availability.sort((a, b) => (a.slot || '').localeCompare(b.slot || ''));
    
    return NextResponse.json(availability);
  } catch (error) {
    console.error('Database error:', error);
    // Always return an array, even on error
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const tableName = await getAvailabilityTable();
    const body = await request.json();
    
    const id = await generateId();
    
    const slot = {
      id,
      ...body,
      startTime: body.startTime,
      endTime: body.endTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: slot,
    });
    
    await docClient.send(putCommand);
    return NextResponse.json({ message: 'Availability slot added!', id: id }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const tableName = await getAvailabilityTable();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Scan for all availability slots
    const scanCommand = new ScanCommand({
      TableName: tableName,
      FilterExpression: '#date < :today',
      ExpressionAttributeNames: {
        '#date': 'date'
      },
      ExpressionAttributeValues: {
        ':today': todayStr
      }
    });
    
    const result = await docClient.send(scanCommand);
    const itemsToDelete = result.Items || [];
    
    // Delete items one by one (DynamoDB doesn't support bulk delete with filter)
    let deletedCount = 0;
    for (const item of itemsToDelete) {
      const deleteCommand = new DeleteCommand({
        TableName: tableName,
        Key: { id: item.id }
      });
      await docClient.send(deleteCommand);
      deletedCount++;
    }
    
    console.log(`Deleted ${deletedCount} availability slots before ${todayStr}`);
    
    return NextResponse.json({ 
      message: `Deleted ${deletedCount} availability slots before ${todayStr}`,
      deletedCount: deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 