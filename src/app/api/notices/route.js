import { NextResponse } from 'next/server';
import { GetCommand, PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, getNoticesTable } from '../../../lib/dynamodb';

// GET - Get all notices or active notice
export async function GET(request) {
  try {
    const tableName = await getNoticesTable();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    if (activeOnly) {
      // Get only the active notice
      const getCommand = new GetCommand({
        TableName: tableName,
        Key: { id: 'active' }
      });

      try {
        const result = await docClient.send(getCommand);
        return NextResponse.json(result.Item || null);
      } catch (error) {
        if (error.name === 'ResourceNotFoundException') {
          console.log('📢 Notices table does not exist yet');
          return NextResponse.json(null);
        }
        throw error;
      }
    }

    // Get all notices
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });

    try {
      const result = await docClient.send(scanCommand);
      const notices = result.Items || [];
      return NextResponse.json(notices);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log('📢 Notices table does not exist yet');
        return NextResponse.json([]);
      }
      throw error;
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

// POST - Create or update notice
export async function POST(request) {
  try {
    const tableName = await getNoticesTable();
    const body = await request.json();
    const { message, isActive, discountType, discountValue, discountThreshold, discountCode, expiresAt } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const notice = {
      id: 'active', // Only one active notice at a time
      message,
      isActive: isActive || false,
      discountType: discountType || 'percentage',
      discountValue: discountValue || 0,
      discountThreshold: discountThreshold || 0,
      discountCode: discountCode || '',
      expiresAt: expiresAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: notice
    });

    try {
      await docClient.send(putCommand);
      return NextResponse.json({ 
        message: 'Notice updated successfully', 
        notice 
      }, { status: 201 });
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        return NextResponse.json({ 
          error: 'Notices table does not exist. Please create the DynamoDB table first.',
          details: 'Run the create-notices-table.js script to set up the database.'
        }, { status: 503 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}

// DELETE - Remove notice
export async function DELETE(request) {
  try {
    const tableName = await getNoticesTable();
    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id: 'active' }
    });

    try {
      await docClient.send(deleteCommand);
      return NextResponse.json({ message: 'Notice deleted successfully' });
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        return NextResponse.json({ 
          error: 'Notices table does not exist',
          details: 'No notice to delete.'
        }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
} 