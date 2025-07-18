import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://0xinniliu0:8jjACBeKsHfGBHb4@cluster0.rt9jscl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("markham-restring");
}

export async function getBookingsCollection() {
  const db = await getDb();
  return db.collection("bookings");
}

export async function getStringsCollection() {
  const db = await getDb();
  return db.collection("strings");
}

export async function getAvailabilityCollection() {
  const db = await getDb();
  return db.collection("availability");
} 