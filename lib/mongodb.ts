import { MongoClient, ServerApiVersion } from "mongodb"
import mongoose from "mongoose"

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://Joe:passwordton@cluster0.vfu5clc.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export { connectToDatabase, client }
