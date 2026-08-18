/**
 * server/index.js
 * Express application entry point.
 * Starts the API server that the frontend consumes.
 *
 * Usage:
 *   node server/index.js
 *   or via package.json: npm run server
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import organizationsRouter from './routes/organizations.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
}))

app.use(express.json())

// ─── Request logger (dev only) ────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`→ ${req.method} ${req.originalUrl}`)
    next()
  })
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/organizations', organizationsRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error.' })
})

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Canopus Labs API running on http://localhost:${PORT}`)
      console.log(`   Health: http://localhost:${PORT}/api/health`)
      console.log(`   Orgs:   http://localhost:${PORT}/api/organizations`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
