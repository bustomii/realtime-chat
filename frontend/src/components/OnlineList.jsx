import Avatar from "./Avatar";

export default function OnlineList({ users = [] }) {
  return (
    <aside className="w-44 border-r px-2 py-4 space-y-3 bg-white/50">
      <div className="font-semibold bg-green-500 px-2 py-1 rounded-lg text-white text-center">Online ({users.length})</div>
      <ul className="space-y-2 text-sm">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <div>
              <Avatar name={u.username} size={20} />
            </div>
            <span className="text-sm truncate">{u.username}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}


