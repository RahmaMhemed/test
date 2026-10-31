import { useEffect, useState } from 'react'
import './App.css'

const cards = [
  {
    title: 'Midnight Mood',
    text: 'Neon thoughts, soft jazz, and a little chaos in the best possible way.',
    tag: 'Design',
  },
  {
    title: 'Coffee Signal',
    text: 'A strong brew and a suspiciously productive idea that appeared at 2:17 AM.',
    tag: 'Productivity',
  },
  {
    title: 'Pixel Garden',
    text: 'Tiny experiments, big dreams, and a field of creative bugs worth keeping.',
    tag: 'Creative',
  },
]

const stats = [
  { label: 'Ideas', value: '128' },
  { label: 'Mood', value: 'Zen+' },
  { label: 'Energy', value: '91%' },
]

function App() {
  const [randomIdea, setRandomIdea] = useState('Loading...')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [formData, setFormData] = useState({ name: 'Tester', message: 'Hello backend!' })
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' })
  const [responseText, setResponseText] = useState('')

  useEffect(() => {
    fetch('/api/random')
      .then((res) => res.json())
      .then((data) => setRandomIdea(data.idea))
      .catch(() => setRandomIdea('Backend unavailable'))
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
      setResponseText('Users loaded from backend.')
    } catch (error) {
      setResponseText('Failed to load users.')
    }
  }

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data)
      setResponseText('Posts loaded from backend.')
    } catch (error) {
      setResponseText('Failed to load posts.')
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await res.json()

      if (!res.ok) {
        setResponseText(data.error || 'User creation failed.')
        return
      }

      setResponseText(`User added: ${data.name} (${data.email})`)
      setNewUser({ name: '', email: '', role: 'user' })
      loadUsers()
    } catch (error) {
      setResponseText('Failed to create user.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      setResponseText(data.response)
    } catch (error) {
      setResponseText('Request failed: backend unreachable.')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">NovaLoop</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Journal</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Random content generator</p>
          <h1>Build a weird little universe and call it progress.</h1>
          <p className="subtitle">
            This dummy app is full of stylish nonsense, half-baked ideas, and enough
            personality to make a prototype feel alive.
          </p>
          <div className="cta-row">
            <button type="button" onClick={() => fetch('/api/random').then((res) => res.json()).then((data) => setRandomIdea(data.idea))}>Launch idea</button>
            <button type="button" className="secondary">View notes</button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="panel-body">
            <p>Current spark</p>
            <h2>“{randomIdea}”</h2>
            <ul>
              <li>12 micro-ideas</li>
              <li>7 collaborators</li>
              <li>3 tiny wins</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stats">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="card-grid">
        {cards.map((card) => (
          <article key={card.title} className="info-card">
            <span className="tag">{card.tag}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="test-panel">
        <h3>Backend test</h3>
        <div className="api-buttons">
          <button type="button" onClick={loadUsers}>Load Users</button>
          <button type="button" className="secondary" onClick={loadPosts}>Load Posts</button>
        </div>

        <form onSubmit={handleCreateUser} className="test-form">
          <h4>Add user to database</h4>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="text"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            placeholder="Role"
          />
          <button type="submit">Add user</button>
        </form>

        <form onSubmit={handleSubmit} className="test-form">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
          />
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Message"
          />
          <button type="submit">Send to backend</button>
        </form>

        {responseText && <p className="response-box">{responseText}</p>}

        {users.length > 0 && (
          <div className="data-box">
            <h4>Users</h4>
            <pre>{JSON.stringify(users, null, 2)}</pre>
          </div>
        )}

        {posts.length > 0 && (
          <div className="data-box">
            <h4>Posts</h4>
            <pre>{JSON.stringify(posts, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
