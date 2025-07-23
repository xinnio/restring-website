import { NextResponse } from 'next/server';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../../../../lib/dynamodb';

export async function GET(request, { params }) {
  try {
    const tableName = process.env.DYNAMODB_AVAILABILITY_TABLE;
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
    const tableName = process.env.DYNAMODB_AVAILABILITY_TABLE;
    const { id } = params;
    const body = await request.json();
    
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
    
    // Handle different types of updates
    let updateExpression = 'SET updatedAt = :updatedAt';
    let expressionAttributeNames = {};
    let expressionAttributeValues = {
      ':updatedAt': new Date().toISOString()
    };
    
    // Handle status updates
    if (body.status) {
      updateExpression += ', #status = :status';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = body.status;
    }
    
    // Handle payment status updates
    if (body.paymentStatus) {
      updateExpression += ', #paymentStatus = :paymentStatus';
      expressionAttributeNames['#paymentStatus'] = 'paymentStatus';
      expressionAttributeValues[':paymentStatus'] = body.paymentStatus;
      if (body.paymentStatus === 'Paid') {
        updateExpression += ', paymentReceivedAt = :paymentReceivedAt';
        expressionAttributeValues[':paymentReceivedAt'] = new Date().toISOString();
      }
    }
    
    // Handle pickup data updates
    const pickupFields = [
      'pickupTime', 'pickupLocation', 'pickupSlotId', 'pickupDate', 
      'pickupStartTime', 'pickupEndTime', 'pickupScheduledAt', 
      'pickupWindow', 'specialPickupRequest',
      'autoPickupTime', 'actualPickupTime' // Add these two fields
    ];
    
    pickupFields.forEach(field => {
      if (body[field] !== undefined) {
        updateExpression += `, ${field} = :${field}`;
        expressionAttributeValues[`:${field}`] = body[field];
      }
    });
    
    // Update the booking
    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: { id: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    
    const updateResult = await docClient.send(updateCommand);
    const updatedBooking = updateResult.Attributes;
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const tableName = process.env.DYNAMODB_AVAILABILITY_TABLE;
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