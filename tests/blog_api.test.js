const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

var lengthOfBlogs = 0

beforeAll(async () => {
  const response = await api.get('/api/blogs')

  lengthOfBlogs = response.body.length

})



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('the number of blog post is correct', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(lengthOfBlogs)
}, 100000)

test('id is defined', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test.only('HTTP POST request successfully creates a new blog post', async () => {

  const newBlog = {
    title: 'aaa',
    author: 'bbb',
    url: '...',
    likes: 1234,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201 || 200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(lengthOfBlogs + 1)
  expect(titles).toContain(
    'aaa'
  )
})

test.only('HTTP POST request without likes property defaults to zero', async () => {

  const newBlog = {
    title: 'xxx',
    author: 'bbb',
    url: '...'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201 || 200)
  const response = await api.get('/api/blogs')

  expect(response.body[-1].likes).toBe(0)

})

test('if the title or url properties are missing then 400-error', async () => {

  const newBlogNoTitle = {
    author: 'bbb',
    url: '...',
    likes: 99
  }

  const newBlogNoAuthor = {
    title: 'aaa',
    url: '...',
    likes: 99
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogNoAuthor)
    .expect(400)

})

afterAll(async () => {
  await mongoose.connection.close()
})