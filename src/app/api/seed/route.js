import { docClient, generateId } from '../../../lib/dynamodb';
import { PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const bookingsTable = process.env.BOOKINGS_TABLE;
    const stringsTable = process.env.STRINGS_TABLE;
    const availabilityTable = process.env.AVAILABILITY_TABLE;

    // Sample strings
    const sampleStrings = [
      { name: 'Yonex BG65', type: 'badminton', color: 'White', quantity: 10, description: 'Durable synthetic gut' },
      { name: 'Yonex BG80', type: 'badminton', color: 'Yellow', quantity: 8, description: 'High performance' },
      { name: 'Wilson NXT', type: 'tennis', color: 'Natural', quantity: 12, description: 'Multifilament string' },
      { name: 'Babolat RPM Blast', type: 'tennis', color: 'Black', quantity: 6, description: 'Polyester string' },
      { name: 'Victor VBS-66N', type: 'badminton', color: 'Blue', quantity: 15, description: 'Nylon string' }
    ];

    // Sample bookings
    const sampleBookings = [
      {
        fullName: 'John Smith',
        contactInfo: 'markhamrestring@gmail.com',
        racketType: 'tennis',
        stringType: 'Wilson NXT',
        stringColor: 'Natural',
        stringTension: '55',
        ownString: false,
        grommetReplacement: false,
        turnaroundTime: 'nextDay',
        pickupDropoff: 'Wiser Park Tennis Courts',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        fullName: 'Sarah Johnson',
        contactInfo: 'markhamrestring@gmail.com',
        racketType: 'badminton',
        stringType: 'Yonex BG65',
        stringColor: 'White',
        stringTension: '24',
        ownString: true,
        grommetReplacement: true,
        turnaroundTime: '3-5days',
        pickupDropoff: 'Angus Glen Community Centre',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    // Sample availability slots
    const sampleAvailability = [
      {
        date: '2024-06-01',
        time: '10:00',
        location: 'Wiser Park Tennis Courts',
        available: true
      },
      {
        date: '2024-06-01',
        time: '14:00',
        location: 'Angus Glen Community Centre',
        available: true
      },
      {
        date: '2024-06-02',
        time: '11:00',
        location: 'Wiser Park Tennis Courts',
        available: true
      }
    ];

    // Clear existing data
    const tables = [bookingsTable, stringsTable, availabilityTable];
    for (const tableName of tables) {
      const scanCommand = new ScanCommand({ TableName: tableName });
      const result = await docClient.send(scanCommand);
      const items = result.Items || [];
      
      for (const item of items) {
        const deleteCommand = new DeleteCommand({
          TableName: tableName,
          Key: { id: item.id }
        });
        await docClient.send(deleteCommand);
      }
    }

    // Insert sample data
    for (const string of sampleStrings) {
      const id = await generateId();
      const putCommand = new PutCommand({
        TableName: stringsTable,
        Item: { id, ...string, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      });
      await docClient.send(putCommand);
    }

    for (const booking of sampleBookings) {
      const id = await generateId();
      const putCommand = new PutCommand({
        TableName: bookingsTable,
        Item: { id, ...booking }
      });
      await docClient.send(putCommand);
    }

    for (const availability of sampleAvailability) {
      const id = await generateId();
      const putCommand = new PutCommand({
        TableName: availabilityTable,
        Item: { id, ...availability, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      });
      await docClient.send(putCommand);
    }

    return NextResponse.json({ 
      message: 'Sample data added successfully!',
      bookings: sampleBookings.length,
      strings: sampleStrings.length,
      availability: sampleAvailability.length
    }, { status: 200 });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
} 