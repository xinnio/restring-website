import { NextResponse } from 'next/server';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../../../../lib/dynamodb';

export async function GET(request, { params }) {
  try {
    const tableName = process.env.BOOKINGS_TABLE;
    const { id } = params;
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id: id }
    });
    const result = await docClient.send(getCommand);
    if (!result.Item) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(result.Item);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const tableName = process.env.BOOKINGS_TABLE;
    const { id } = params;
    const body = await request.json();
    const { status, emailType } = body;
    // Get the current booking
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id: id }
    });
    const getResult = await docClient.send(getCommand);
    if (!getResult.Item) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    const booking = getResult.Item;
    // Update the booking
    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: { id: id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });
    const updateResult = await docClient.send(updateCommand);
    const updatedBooking = updateResult.Attributes;
    // Optionally send email notification here
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const tableName = process.env.BOOKINGS_TABLE;
    const { id } = params;
    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id: id }
    });
    await docClient.send(deleteCommand);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 