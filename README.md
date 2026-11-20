# interview-haupcar

แอปแยกเป็น 2 โฟลเดอร์ ต้องเปิดคนละเทอร์มินัล

- `frontend` — React (Vite) ที่ http://localhost:5173
- `backend` — NestJS ที่ http://localhost:3000

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

เปิด http://localhost:3000 แล้วจะได้ข้อความ `Hello World!`

เทอร์มินัลที่ 2 รัน frontend:

```powershell
cd frontend
npm run dev
```

เปิด http://localhost:5173 จะอยู่หน้า Home

หน้าที่มีให้เปิด:

- http://localhost:5173/
- http://localhost:5173/user
