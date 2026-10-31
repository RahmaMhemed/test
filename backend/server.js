import express from 'express'
import cors from 'cors'
import { sequelize, User, Post } from './database.js'

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({
      ok: true,
      message: 'Backend is alive and database connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Database connection failed', error: error.message })
  }
})

app.get('/api/users', async (req, res) => {
  const users = await User.findAll({ include: Post })
  res.json(users)
})

app.get('/api/posts', async (req, res) => {
  const posts = await Post.findAll({ include: User })
  res.json(posts)
})

app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body || {}

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  try {
    const user = await User.create({ name, email, role: role || 'user' })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/posts', async (req, res) => {
  const { title, content, authorId } = req.body || {}

  if (!title || !content || !authorId) {
    return res.status(400).json({ error: 'Title, content, and authorId are required' })
  }

  try {
    const post = await Post.create({ title, content, authorId })
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/test', async (req, res) => {
  const { name, message } = req.body || {}

  try {
    const payload = {
      name: name || 'guest',
      message: message || 'No message provided',
      savedAt: new Date().toISOString(),
    }

    await User.findOrCreate({
      where: { email: `${(name || 'guest').toLowerCase().replace(/\s+/g, '')}@dummy.local` },
      defaults: { name: payload.name, email: `${(name || 'guest').toLowerCase().replace(/\s+/g, '')}@dummy.local`, role: 'tester' },
    })

    res.json({
      received: payload,
      response: 'Dummy backend accepted the request successfully and stored the test user.',
      ok: true,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function startServer() {
  try {
    await sequelize.sync({ alter: true })
    app.listen(port, () => {
      console.log(`Dummy backend running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Database sync failed:', error)
    process.exit(1)
  }
}

startServer()
