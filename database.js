// database.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

let db;

async function connectToDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(); // Use default database from connection string
  console.log("Connected to MongoDB");
}

function getDatabase() {
  if (!db) {
    throw new Error("Must connect to database first!");
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDatabase,
};
