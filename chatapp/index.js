const express = require('express')

var app = express()
var port = process.env.PORT || 3003
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.use(express.static('public'))

io.on('connection', (socket) => {
    // console.log('A client got connected!')
    socket.on('chat message', (msg) => {
        console.log('Message: ', msg)
        io.emit('chat message', msg)
    })
})

http.listen(port, () => {
    console.log(`Server is listening on PORT ${port}`)
})