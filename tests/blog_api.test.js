const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const Blog = require('../models/blog')


var lengthOfBlogs = 0

const blogsInDb = async () => {
  const blogsRetrieved = await Blog.find({})
  return blogsRetrieved.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

beforeAll(async () => {
  const response = await api.get('/api/blogs')

  lengthOfBlogs = response.body.length

})

const initialBlogs = [
  {
    title: 'xxx',
    author: 'bbb',
    url: '...',
    likes: 88
  },
  {
    title: 'zzz',
    author: 'iii',
    url: '...',
    likes: 55
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
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
}, 100000)

test('HTTP POST request successfully creates a new blog post', async () => {

  const newBlog = {
    title: 'yyy',
    author: 'bbb',
    url: '...',
    likes: 1234,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(function(res) {
      if (res.statusCode !== 200 && res.statusCode !== 201) {
        throw Error('unexpected status code: ' + res.statusCode)
      }
    })
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(lengthOfBlogs + 1)
  expect(titles).toContain(
    'yyy'
  )
}, 100000)

// This one should maybe stay commented
test('HTTP POST request without likes property defaults to zero', async () => {

  const newBlog = {
    title: 'xxx',
    author: 'bbb',
    url: '...'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(function(res) {
      if (res.statusCode !== 200 && res.statusCode !== 201) {
        throw Error('unexpected status code: ' + res.statusCode)
      }
    })

  /*   const mostRecentBlog = await Blog.find().sort({ $natural:-1 }).limit(1)

  expect(mostRecentBlog.likes).toBe(0) */

  const blogsAtEnd = await blogsInDb()

  const likes = blogsAtEnd.map(r => r.likes)

  expect(likes).toContain(0)

}, 100000)

test('if the title or url properties are missing then 400-error', async () => {

  const newBlogNoTitle = {
    author: 'bbb',
    url: '...',
    likes: 99
  }

  const newBlogNoUrl = {
    title: 'aaa',
    author: 'heyho',
    likes: 99
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogNoUrl)
    .expect(400)

  const blogsAtEnd = await blogsInDb()

  expect(blogsAtEnd).toHaveLength(initialBlogs.length)

}, 100000)



afterAll(async () => {
  await mongoose.connection.close()
})

