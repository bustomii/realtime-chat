import Avatar from './Avatar'
import Time from './Time'

export default function MessageItem({ message, isOwn }) {
  const isSystem = message.username === 'system'
  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
          {message.text}
        </div>
      </div>
    )
  }
  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && <Avatar name={message.username} size={28} />}
      <div className={`max-w-[70%] rounded-2xl px-3 py-2 border ${isOwn ? 'bg-black text-white border-black' : 'bg-white text-black'} shadow-sm`}>
        <div className="flex items-center gap-2">
          {!isOwn && <span className="text-xs font-medium text-gray-600">{message.username}</span>}
          <Time value={message.timestamp} isOwn={isOwn} />
        </div>
        <div className="mt-1 whitespace-pre-wrap text-sm">{message.text}</div>
      </div>
      {isOwn && <Avatar name={message.username} size={28} />}
    </div>
  )
}


