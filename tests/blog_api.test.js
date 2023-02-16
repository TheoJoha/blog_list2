const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are five blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(5)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})