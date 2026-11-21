# interview-haupcar

ระบบเช่ารถ: React frontend + NestJS API + PostgreSQL

## Deploy frontend บน Vercel

Vercel โฮสต์ **frontend อย่างเดียว** — Nest API ต้องมี URL สาธารณะแยก (Docker / Railway / Render)

ใน Vercel → Project Settings:

| Setting | ค่า |
| --- | --- |
| Root Directory | ว่าง (ใช้ `vercel.json` ที่ root) **หรือ** `frontend` |
| Framework Preset | Other / Vite |
| Environment | `API_URL` = `https://<backend-host>/api` ชนิด **Config** (ห้ามเป็น Secret) |

ตัวอย่าง: ถ้า API อยู่ที่ `https://haupcar-api.onrender.com` ให้ตั้ง `API_URL=https://haupcar-api.onrender.com/api` แล้ว Redeploy

ถ้าไม่ตั้ง `API_URL` แอปจะเรียก `/api` บนโดเมน Vercel → ไม่มี Nest → login/CRUD พัง

ตรวจงานครบระบบแนะนำ `docker compose up --build` แทน Vercel

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

Compose จะรัน Postgres, migrate, seed (รถ 100 คัน + user demo) แล้วเปิด frontend ผ่าน nginx ที่ proxy `/api` ไป backend

---

## รันแบบ local (ไม่มี Docker)

แอปแยกเป็น 2 โฟลเดอร์ ต้องเปิดคนละเทอร์มินัล

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
