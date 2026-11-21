# interview-haupcar

ระบบเช่ารถ: React frontend + NestJS API + PostgreSQL

## Vercel (2 โปรเจกต์)

| โปรเจกต์ | Root Directory | Domain |
| --- | --- | --- |
| API `interview-haupcar` | `backend` | https://interview-haupcar.vercel.app |
| Web `interview-haupcar-93hn` | `frontend` | https://interview-haupcar-93hn.vercel.app |

### API project env (Secret/Config ตามความเหมาะสม)

- `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`
- `CORS_ORIGINS=https://interview-haupcar-93hn.vercel.app` (หรือปล่อยให้โค้ดรับ `*.vercel.app`)

### Web project env (**Config**)

```
API_URL=https://interview-haupcar.vercel.app/api
```

แล้ว Redeploy ทั้งสองโปรเจกต์

Login demo หลัง seed: `admin` / `admin123`

---

## ตรวจงานด้วย Docker (แนะนำ)

ต้องมี [Docker Desktop](https://www.docker.com/products/docker-desktop/) ติดตั้งไว้

```bash
docker compose up --build
```

เปิด http://localhost:8080

| รายการ | ค่า |
| --- | --- |
| Web | http://localhost:8080 |
| API | http://localhost:3000/api |
| Login | `admin` / `admin123` |

หยุดและลบ volume (reset DB):

```bash
docker compose down -v
```

---

## รันแบบ local (ไม่มี Docker)

- `frontend` — React, MUI, TanStack Query, Zustand, React Hook Form, Zod
- `backend` — NestJS ที่ http://localhost:3000/api

ต้องมี [Node.js LTS](https://nodejs.org/) และ PostgreSQL (หรือใช้ `docker compose up db -d`)

### ติดตั้ง

```powershell
cd frontend
npm install

cd ../backend
npm install
```

คัดลอก env:

```powershell
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

ตั้ง `DATABASE_URL` / `DIRECT_URL` / `JWT_SECRET` ใน `backend/.env` แล้ว:

```powershell
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### รัน

เทอร์มินัลที่ 1:

```powershell
cd backend
npm run start:dev
```

เทอร์มินัลที่ 2:

```powershell
cd frontend
npm run dev
```

เปิด http://localhost:5173

Frontend ใช้ `API_URL` ตอน build (ค่าเริ่มต้น `/api`) และ Vite proxy `/api` ไป backend ตอน `npm run dev`
