import { useRef } from 'react'

export default function ChatForm({ value, onChange, onSubmit }) {
  const ref = useRef(null)
  const submit = () => {
    onSubmit?.()
    ref.current?.focus()
  }
  return (
    <div className="px-4 pb-4 space-y-2">
      <div className="flex gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Tulis pesan"
          className="flex-1 border rounded-md h-11 px-3"
        />
        <button onClick={submit} className="h-11 rounded-md bg-black text-white px-4">Kirim</button>
      </div>
    </div>
  )
}


