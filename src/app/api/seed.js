import { getBookingsCollection, getStringsCollection, getAvailabilityCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const bookingsCollection = await getBookingsCollection();
    const stringsCollection = await getStringsCollection();
    const availabilityCollection = await getAvailabilityCollection();

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
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000)
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
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000)
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

    // Clear existing data and insert sample data
    await bookingsCollection.deleteMany({});
    await stringsCollection.deleteMany({});
    await availabilityCollection.deleteMany({});

    await bookingsCollection.insertMany(sampleBookings);
    await stringsCollection.insertMany(sampleStrings);
    await availabilityCollection.insertMany(sampleAvailability);

    res.status(200).json({ 
      message: 'Sample data added successfully!',
      bookings: sampleBookings.length,
      strings: sampleStrings.length,
      availability: sampleAvailability.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
} 