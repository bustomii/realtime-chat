## Realtime Chat Application (WebSocket)

### Ringkasan
Proyek ini adalah aplikasi chat real-time sederhana dengan backend Node.js (Express + Socket.IO) dan frontend React + Tailwind. Mendukung multi-user, daftar online, pesan real-time, timestamp, nama pengirim, dan history. Fitur tambahan: typing indicator, notifikasi reconnect, dan rate limiting sederhana.

### URL DEMO
- https://realtime-chat-demo.musepedia.space

### Struktur Proyek
```
backend/      # Express + Socket.IO + REST
frontend/     # Vite React + Tailwind
```

### Prasyarat
- Node.js 18+

### Menjalankan Backend
```
cd backend
npm install
npm run dev  # http://localhost:4000
```

Endpoint REST:
- GET `/api/health`
- GET `/api/users/online`
- GET `/api/messages?limit=100`

WebSocket (Socket.IO):
- Event `join` payload: `{ username }` -> callback `{ ok, history }`
- Event `message` payload: `{ text }` -> broadcast `message`
- Event `typing` payload: `{ isTyping: boolean }` -> broadcast `typing`
- Broadcast `system` untuk join/leave
- Broadcast `online` untuk daftar user

Rate limiting pesan: maksimal 5 pesan/3 detik per koneksi.

### Menjalankan Frontend
```
cd frontend
npm install
npm run dev  # http://localhost:5173
```

Konfigurasi URL backend:
- Ubah `VITE_WS_URL` di file `.env` frontend jika perlu (default `http://localhost:4000`).

### Postman Collection
File: `backend/postman_collection.json`
- Set variable `BASE_URL` (default `http://localhost:4000`).

### Catatan Implementasi
- Backend: `src/server.js`, `src/socket.js`, `src/routes.js`, `src/store.js`
- Frontend: komponen utama di `src/App.jsx`

### Dockerize 
- menggunakan docker-compose.yml
- Backend: backend/DockerFile
- Frontend: fronend/DockerFile
- Run: WS_URL=http://host-backend:port docker compose build --no-cache && docker compose up -d

### Build Project
```
cd frontend && npm run build
```

### Lisensi & Referensi
- Socket.IO (`https://socket.io`)
- Vite (`https://vite.dev`), React (`https://react.dev`), Tailwind (`https://tailwindcss.com`)


