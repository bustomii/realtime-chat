export default function Avatar({ name = "?", size = 32 }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("")
    .slice(0, 2);
  const colors = [
    "bg-rose-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-fuchsia-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  const cls = colors[Math.abs(hash) % colors.length];
  const style = { width: size, height: size };
  return (
    <div
      className={`rounded-full ${cls} text-white flex items-center justify-center select-none`}
      style={style}
      aria-label={name}
      title={name}
    >
      <span className="text-xs font-semibold">{initials || "?"}</span>
    </div>
  );
}


