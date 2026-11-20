# interview-haupcar

แอปแยกเป็น 2 โฟลเดอร์ ต้องเปิดคนละเทอร์มินัล

- `frontend` — React, MUI, TanStack Query, Zustand, React Hook Form, Zod
- `backend` — NestJS ที่ http://localhost:3000/api

ต้องมี [Node.js LTS](https://nodejs.org/) ติดตั้งไว้ก่อน

## ติดตั้ง

```powershell
cd frontend
npm install

cd ../backend
npm install
```

## รัน

เทอร์มินัลที่ 1 รัน backend:

```powershell
cd backend
npm run start:dev
```

เทอร์มินัลที่ 2 รัน frontend:

```powershell
cd frontend
npm run dev
```

เปิด http://localhost:5173

- http://localhost:5173/ หน้า Home
- http://localhost:5173/user ฟอร์มผู้ใช้ บันทึกไปที่ `PUT /api/users`

ตัวแปร `VITE_API_URL` มีค่าเริ่มต้นเป็น `http://localhost:3000/api`
