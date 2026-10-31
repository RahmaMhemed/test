import { sequelize, User, Post } from './database.js'

async function seed() {
  await sequelize.sync({ force: true })

  const users = await User.bulkCreate([
    { name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'editor' },
    { name: 'Charlie', email: 'charlie@example.com', role: 'user' },
  ])

  await Post.bulkCreate([
    { title: 'Hello world', content: 'This is my first post from SQLite.', authorId: users[0].id },
    { title: 'Random idea', content: 'A robot that waters plants and tells jokes.', authorId: users[1].id },
    { title: 'Testing notes', content: 'Database is connected and working.', authorId: users[2].id },
  ])

  console.log('Seed complete')
  await sequelize.close()
}

seed()
