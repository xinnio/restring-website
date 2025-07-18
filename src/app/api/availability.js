import { getAvailabilityCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const collection = await getAvailabilityCollection();

    if (req.method === 'GET') {
      const availability = await collection.find({}).sort({ slot: 1 }).toArray();
      res.status(200).json(availability);
    } else if (req.method === 'POST') {
      const slot = {
        ...req.body,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(slot);
      res.status(201).json({ message: 'Availability slot added!', id: result.insertedId });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
} 