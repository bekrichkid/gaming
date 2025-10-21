import { io, Socket } from 'socket.io-client'

const socket = new io('http://localhost:8000')

export default socket
