const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8081 })

wss.on('connection', function connection(ws) {
  console.log('✅ Client connected')

  ws.on('message', function incoming(data) {
    const { message, subject } = JSON.parse(data)

    let reply = ''
    switch (subject) {
      case 'math':
        reply = `To solve "${message}", use algebra or calculus!`
        break
      case 'history':
        reply = `That event happened in the 18th century.`
        break
      case 'science':
        reply = `That's a core principle in physics or chemistry.`
        break
      case 'geography':
        reply = `That's a well-known region in Asia.`
        break
      default:
        reply = `Interesting! Here's what I think: ${message}`
    }

    setTimeout(() => {
      ws.send(JSON.stringify({ message: reply }))
    }, 1000)
  })

  ws.on('close', () => console.log('❌ Client disconnected'))
})

console.log('🧠 Mock WebSocket server running at ws://localhost:8081')
