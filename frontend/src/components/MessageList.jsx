import { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'

export default function MessageList({ messages, username }) {
  const listRef = useRef(null)
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  return (
    <div className="flex-1 p-4 overflow-auto" ref={listRef}>
      <div className="space-y-3 max-w-3xl mx-auto">
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} isOwn={m.username === username} />
        ))}
      </div>
    </div>
  )
}


