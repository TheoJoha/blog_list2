const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  let likes = 0
  for (let i = 0; i < blogs.length; i++) {
    likes += blogs[i].likes
  }
  return likes
}

const blogWithMostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  let mostLikes = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes >= mostLikes) {
      mostLikes = i
    }
  }
  return blogs[mostLikes]

}

module.exports = {
  dummy,
  totalLikes,
  blogWithMostLikes
}