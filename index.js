require('dotenv').config()
require('./src/db/connection')

const express = require('express')
const cors = require('cors')
const router = require('./src/routers/router')

const blogServer = express()

blogServer.use(cors())
blogServer.use(express.json())
blogServer.use(router)
blogServer.use('/uploads', express.static('src/uploads'))

const PORT = process.env.PORT || 5000

blogServer.listen(PORT,()=>{
    console.log(`Blogg server running successfully at port number ${PORT}`);
})

blogServer.get('/',(req,res)=>{
    res.send('<h1>Server running successfully and ready to accept clint request</h1>')
})