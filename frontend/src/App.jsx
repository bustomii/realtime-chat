import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import { Toaster, toast } from 'sonner'
import MessageList from './components/MessageList'
import ChatForm from './components/ChatForm'
import OnlineList from './components/OnlineList'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000'

function Login({ onJoin }) {
  const [username, setUsername] = useState('')
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm rounded-lg border p-6 space-y-4">
        <h1 className="text-xl font-semibold">Masuk ke Chat</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border rounded-md h-10 px-3"
          onKeyDown={(e) => e.key === 'Enter' && username.trim() && onJoin(username.trim())}
        />
        <button
          onClick={() => username.trim() && onJoin(username.trim())}
          className="w-full h-10 rounded-md bg-black text-white"
        >
          Join
        </button>
      </div>
    </div>
  )
}

function Chat({ username }) {
  const socket = useMemo(() => io(WS_URL, { autoConnect: false }), [])
  const [online, setOnline] = useState([])
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const typingTimeout = useRef(null)

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.emit('join', { username }, (res) => {
      if (res?.ok) {
        setMessages(res.history || [])
      } else {
        toast.error('Gagal join')
      }
    })

    socket.on('online', (payload) => setOnline(payload.users || []))
    socket.on('system', (msg) => setMessages((prev) => [...prev, msg]))
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]))
    socket.on('typing', ({ username: u, isTyping }) => {
      setTypingUsers((prev) => {
        const next = { ...prev }
        if (isTyping) next[u] = true
        else delete next[u]
        return next
      })
    })

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [socket, username])

  const sendMessage = () => {
    const value = text.trim()
    if (!value) return
    socket.emit('message', { text: value }, (res) => {
      if (!res?.ok) toast.error(res?.error || 'Gagal kirim')
    })
    setText('')
  }

  const handleTyping = (val) => {
    setText(val)
    socket.emit('typing', { isTyping: true })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing', { isTyping: false })
    }, 800)
  }

  return (
    <div className="h-screen flex bg-neutral-50">
      <OnlineList users={online} />
      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 flex items-center justify-between bg-white/70 backdrop-blur">
          <div className="font-semibold">Real-time Messaging</div>
          <div className="text-sm">{connected ? 'Terhubung' : 'Terputus'}</div>
        </header>
        <div className="px-4 py-4 text-xs h-4 flex items-center justify-center text-blue-500">
          {Object.keys(typingUsers).length > 0 && (
            <span>{Object.keys(typingUsers).join(', ')} sedang mengetik...</span>
          )}
        </div>
        <MessageList messages={messages} username={username} />
        <ChatForm value={text} onChange={(v) => handleTyping(v)} onSubmit={sendMessage} />
      </main>
      <Toaster richColors />
    </div>
  )
}

export default function App() {
  const [username, setUsername] = useState('')
  if (!username) return <Login onJoin={setUsername} />
  return <Chat username={username} />
}
