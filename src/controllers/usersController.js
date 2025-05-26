const users = require('../models/usersSchema')
const Blogs = require('../models/blogSchema')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const fs = require('fs')
const path = require('path')

exports.register = async (req, res) => {
    console.log('inside register controller');

    const { name, email, password } = req.body
    try {
        const existUser = await users.findOne({ email })

        if (existUser) {
            res.status(406).json('User already exist. Please login')
        }
        else {
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new users({
                name,
                email,
                password: hashedPassword

            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(401).json(`Registration failed dew to ${error}`)
    }
}

exports.login = async (req, res) => {
    console.log('Inside login controller');

    const { email, password } = req.body;

    try {
        const existUser = await users.findOne({ email })
        if (!existUser) {
            return res.status(406).json('Incorrect email or password')
        }

        const isMatch = await bcrypt.compare(password, existUser.password)
        if (!isMatch) {
            return res.status(406).json('Incorrect email or password')
        }

        const token = jwt.sign({ userId: existUser._id }, process.env.SECRETKEY)
        console.log('Token is', token);


        return res.status(200).json({ existUser, token })
    } catch (error) {
        return res.status(401).json(`Login failed due to ${error}`)
    }
}

exports.addProduct = async (req, res) => {
    console.log('inside addProject controller');
    const { title, subHead, content, userName } = req.body
    console.log(userName);
    const blogImage = req.file.filename
    // console.log(blogImage);
    const userId = req.payload
    console.log(userId);


    try {
        const existingBlog = await Blogs.findOne({ title })

        if (existingBlog) {
            res.status(406).json({ message: 'The blog with the same title is alredy exist..Plese edit your title' })
        }
        else {
            const newBlogs = new Blogs({
                title, subHead, content, blogImage, userName, userId
            })
            await newBlogs.save()
            res.status(200).json(existingBlog)
        }
    } catch (error) {
        res.status(401).json({ message: `request failed due to ${error}` })
    }

}

exports.getAllblogs = async (req, res) => {
    try {
        const allBlogs = await Blogs.find()
        res.status(200).json(allBlogs)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

exports.getUserblogs = async (req, res) => {
    const userId = req.params.userId

    try {
        const userBlogs = await Blogs.find({ userId });
        res.status(200).json(userBlogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user blogs", error });
    }
}

exports.updateBlog = async (req, res) => {
    const blogId = req.params.id
    const { title, subHead, content } = req.body

    try {
        const existingBlog = await Blogs.findById(blogId)
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // update core fields
        existingBlog.title = title;
        existingBlog.subHead = subHead;
        existingBlog.content = content;

        // if new image
        if (req.file && req.file.filename) {
            // delete old
            if (existingBlog.blogImage) {
                const oldPath = path.join(__dirname, '..', '/uploads', existingBlog.blogImage)
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.log('Failed to delete old image:', err)
                    }
                })
            }

            // update the image field
            existingBlog.blogImage = req.file.filename
        }

        await existingBlog.save()

        res.status(200).json({ message: 'Blog updated successfully', blog: existingBlog })

    } catch (error) {
        console.error('Error updating blog:', error)
        res.status(500).json({ message: 'Server error during blog update' })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blogs.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' })
        }

        //image file path
        const imgPath = path.join(__dirname, '..', 'uploads', blog.blogImage)

        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath)
        } else {
            console.log('Image file not found on disk, skipping deletion.')
        }

        await Blogs.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: 'Blog deleted successfully' })

    } catch (error) {
        console.error('Error deleting blog:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
