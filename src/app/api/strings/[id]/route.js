import { getStringsCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid string ID' }, { status: 400 });
  }

  try {
    const collection = await getStringsCollection();
    const string = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!string) {
      return NextResponse.json({ error: 'String not found' }, { status: 404 });
    }

    return NextResponse.json(string);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid string ID' }, { status: 400 });
  }

  try {
    const collection = await getStringsCollection();
    const body = await request.json();
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'String not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'String updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid string ID' }, { status: 400 });
  }

  try {
    const collection = await getStringsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'String not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'String deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 