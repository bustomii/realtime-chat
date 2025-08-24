export default function Time({ value, isOwn = false }) {
  const d = value ? new Date(value) : new Date();
  const text = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return <time dateTime={d.toISOString()} className={`text-[10px] ${isOwn ? 'text-white' : 'text-gray-500'}`}>{text}</time>;
}


