const http = require('http')
const express = require('express')
const cors = require('cors')
const socketConnection = require('./socket/socket')

const app = express()
app.use(cors())
const server = http.createServer(app)
socketConnection(server)

server.listen(8000, () => {
    console.log('Server is running on port 8000')
})
