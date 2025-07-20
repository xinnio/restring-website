import { docClient, generateId } from '../../../lib/dynamodb';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tableName = process.env.STRINGS_TABLE;
    
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });
    
    const result = await docClient.send(scanCommand);
    const strings = result.Items || [];
    
    // Sort by name
    strings.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    return NextResponse.json(strings);
  } catch (error) {
    console.error('Database error:', error);
    // Always return an array, even on error
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const tableName = process.env.STRINGS_TABLE;
    const body = await request.json();
    
    const id = await generateId();
    
    const string = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: string,
    });
    
    await docClient.send(putCommand);
    return NextResponse.json({ message: 'String added!', id: id }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 