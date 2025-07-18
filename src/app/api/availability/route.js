import { getAvailabilityCollection } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collection = await getAvailabilityCollection();
    const availability = await collection.find({}).sort({ slot: 1 }).toArray();
    return NextResponse.json(availability);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const collection = await getAvailabilityCollection();
    const body = await request.json();
    const slot = {
      ...body,
      startTime: body.startTime,
      endTime: body.endTime,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await collection.insertOne(slot);
    return NextResponse.json({ message: 'Availability slot added!', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 