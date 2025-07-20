import { docClient } from '../../../../lib/dynamodb';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const tableName = process.env.STRINGS_TABLE;
    const { id } = params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ 
        error: 'Invalid string ID provided',
        details: 'String ID is missing or undefined'
      }, { status: 400 });
    }

    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const result = await docClient.send(getCommand);
    if (!result.Item) {
      return NextResponse.json({
        error: 'String not found',
        details: 'The string you are looking for does not exist'
      }, { status: 404 });
    }
    return NextResponse.json(result.Item);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const tableName = process.env.STRINGS_TABLE;
    const { id } = params;
    const body = await request.json();

    if (!id || id === 'undefined') {
      return NextResponse.json({ 
        error: 'Invalid string ID provided',
        details: 'String ID is missing or undefined'
      }, { status: 400 });
    }

    // Build update expression
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(body).forEach(key => {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = body[key];
    });

    // Add updatedAt
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(updateCommand);
    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const tableName = process.env.STRINGS_TABLE;
    const { id } = params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ 
        error: 'Invalid string ID provided',
        details: 'String ID is missing or undefined'
      }, { status: 400 });
    }

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    });

    await docClient.send(deleteCommand);
    return NextResponse.json({ message: 'String deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 