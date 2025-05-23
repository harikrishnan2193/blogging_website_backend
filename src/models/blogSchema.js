const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subHead: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  blogImage: {
    type: String,
    required: true
  }
}, { timestamps: true })


const blogs = mongoose.model('blogs', blogSchema)

module.exports = blogs