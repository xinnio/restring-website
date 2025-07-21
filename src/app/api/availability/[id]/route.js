import { NextResponse } from 'next/server';
import { docClient } from '../../../../lib/dynamodb';
import { DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('Delete request received for ID:', id);
    
    if (!id || id === 'undefined') {
      console.log('Invalid ID provided:', id);
      return NextResponse.json({ 
        error: 'Invalid slot ID provided',
        details: 'Slot ID is missing or undefined'
      }, { status: 400 });
    }
    
    const tableName = process.env.AVAILABILITY_TABLE;
    console.log('Attempting to delete from table:', tableName, 'with key:', { id });

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: {
        id: id
      }
    });

    await docClient.send(deleteCommand);
    console.log('Successfully deleted slot with ID:', id);

    return NextResponse.json({ 
      message: 'Availability slot deleted successfully',
      deletedId: id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting availability slot:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      type: error.__type
    });
    
    // Check if it's a ResourceNotFoundException (item doesn't exist)
    if (error.name === 'ResourceNotFoundException' || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ 
        error: 'Availability slot not found',
        details: 'The slot you are trying to delete does not exist'
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to delete availability slot',
      details: error.message 
    }, { status: 500 });
  }
} 

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('Update request received for ID:', id, 'with data:', body);
    
    if (!id || id === 'undefined') {
      console.log('Invalid ID provided:', id);
      return NextResponse.json({ 
        error: 'Invalid slot ID provided',
        details: 'Slot ID is missing or undefined'
      }, { status: 400 });
    }
    
    const tableName = process.env.AVAILABILITY_TABLE;
    console.log('Attempting to update in table:', tableName, 'with key:', { id });

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id
      },
      UpdateExpression: 'SET date = :date, startTime = :startTime, endTime = :endTime, location = :location, available = :available, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':date': body.date,
        ':startTime': body.startTime,
        ':endTime': body.endTime,
        ':location': body.location,
        ':available': body.available,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(updateCommand);
    console.log('Successfully updated slot with ID:', id);

    return NextResponse.json({ 
      message: 'Availability slot updated successfully',
      updatedSlot: result.Attributes
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating availability slot:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      type: error.__type
    });
    
    // Check if it's a ResourceNotFoundException (item doesn't exist)
    if (error.name === 'ResourceNotFoundException' || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ 
        error: 'Availability slot not found',
        details: 'The slot you are trying to update does not exist'
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update availability slot',
      details: error.message 
    }, { status: 500 });
  }
} 