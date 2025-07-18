import { getBookingsCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  try {
    const collection = await getBookingsCollection();

    if (req.method === 'PUT') {
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      // If updating payment status, add payment timestamp
      if (req.body.paymentStatus === 'Paid') {
        updateData.paymentReceivedAt = new Date();
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({ message: 'Booking updated successfully' });
    } else if (req.method === 'GET') {
      const booking = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json(booking);
    } else if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({ message: 'Booking deleted successfully' });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
} 