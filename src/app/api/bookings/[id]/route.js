import { NextResponse } from 'next/server';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, getBookingsTable } from '../../../../lib/dynamodb';

// GET - Get a specific booking
export async function GET(request, { params }) {
  try {
    const tableName = await getBookingsTable();
    const { id } = await params;

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

// PUT - Update booking status and send appropriate emails
export async function PUT(request, { params }) {
  try {
    const tableName = await getBookingsTable();
    const { id } = await params;
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

    // Send appropriate email based on status change
    if (emailType) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: emailType,
            booking: updatedBooking
          })
        });

        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error(`Failed to send ${emailType} email:`, emailResult);
        } else {
          if (emailResult.development) {
            console.log(`📧 ${emailType} email (development mode):`, emailResult);
          } else {
            console.log(`📧 ${emailType} email sent successfully`);
          }
        }
      } catch (emailError) {
        console.error(`${emailType} email error:`, emailError);
      }
    }

    return NextResponse.json({ 
      message: 'Booking updated successfully', 
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// DELETE - Delete a booking
export async function DELETE(request, { params }) {
  try {
    const tableName = await getBookingsTable();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid booking ID provided' }, { status: 400 });
    }

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id: id }
    });

    await docClient.send(deleteCommand);

    return NextResponse.json({ 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 