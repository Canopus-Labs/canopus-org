/**
 * server/db.js
 * MongoDB connection using Mongoose.
 * Call connectDB() once at server startup.
 */

import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DATABASE || 'canopus_labs'

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.')
  }

  try {
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    isConnected = true
    console.log(`✅ MongoDB connected — database: "${dbName}"`)
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    throw err
  }
}

export async function disconnectDB() {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
  console.log('MongoDB disconnected.')
}

export default mongoose
