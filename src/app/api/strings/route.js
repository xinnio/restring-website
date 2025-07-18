import { getStringsCollection } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collection = await getStringsCollection();
    const strings = await collection.find({}).sort({ name: 1 }).toArray();
    return NextResponse.json(strings);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const collection = await getStringsCollection();
    const body = await request.json();
    
    const string = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(string);
    return NextResponse.json({ message: 'String added!', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 