import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fleet = [
  { brand: 'Toyota', model: 'Camry', type: 'เก๋ง', price: 1990, count: 5 },
  { brand: 'Toyota', model: 'Corolla Altis', type: 'เก๋ง', price: 1390, count: 7 },
  { brand: 'Toyota', model: 'Yaris', type: 'แฮทช์แบ็ก', price: 990, count: 7 },
  { brand: 'Toyota', model: 'Fortuner', type: 'SUV', price: 2590, count: 5 },
  { brand: 'Toyota', model: 'Hilux Revo', type: 'กระบะ', price: 1490, count: 5 },
  { brand: 'Toyota', model: 'Commuter', type: 'รถตู้', price: 2990, count: 3 },
  { brand: 'Honda', model: 'Civic', type: 'เก๋ง', price: 1690, count: 4 },
  { brand: 'Honda', model: 'City', type: 'เก๋ง', price: 1290, count: 6 },
  { brand: 'Honda', model: 'HR-V', type: 'SUV', price: 1790, count: 4 },
  { brand: 'Honda', model: 'CR-V', type: 'SUV', price: 2390, count: 3 },
  { brand: 'Mazda', model: 'Mazda2', type: 'แฮทช์แบ็ก', price: 1090, count: 5 },
  { brand: 'Mazda', model: 'Mazda3', type: 'เก๋ง', price: 1590, count: 4 },
  { brand: 'Mazda', model: 'CX-5', type: 'SUV', price: 2290, count: 3 },
  { brand: 'Mazda', model: 'CX-30', type: 'SUV', price: 1890, count: 2 },
  { brand: 'Mitsubishi', model: 'Triton', type: 'กระบะ', price: 1490, count: 4 },
  { brand: 'Mitsubishi', model: 'Xpander', type: 'MPV', price: 1590, count: 4 },
  { brand: 'Mitsubishi', model: 'Pajero Sport', type: 'SUV', price: 2490, count: 3 },
  { brand: 'Isuzu', model: 'D-Max', type: 'กระบะ', price: 1390, count: 4 },
  { brand: 'Isuzu', model: 'MU-X', type: 'SUV', price: 2390, count: 3 },
  { brand: 'Ford', model: 'Ranger', type: 'กระบะ', price: 1590, count: 4 },
  { brand: 'Ford', model: 'Everest', type: 'SUV', price: 2690, count: 3 },
  { brand: 'Nissan', model: 'Almera', type: 'เก๋ง', price: 1090, count: 4 },
  { brand: 'Nissan', model: 'Navara', type: 'กระบะ', price: 1490, count: 3 },
  { brand: 'MG', model: 'MG5', type: 'เก๋ง', price: 990, count: 3 },
  { brand: 'MG', model: 'ZS', type: 'SUV', price: 1390, count: 2 },
];

const series = [
  'กก', 'กข', 'กค', 'กง', 'กจ', 'กช', 'ขก', 'ขข', 'คง', 'งง', 'จก', 'ชก', 'ซก',
  'ดก', 'ตก', 'ทก', 'นก', 'บก', 'ปก', 'พก', 'มก', 'ยก', 'รก', 'ลก', 'สก',
];
const colors = ['ขาว', 'ดำ', 'เทา', 'เงิน', 'แดง', 'น้ำเงิน', 'ขาวมุก', 'น้ำตาล'];
const provinces = [
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  'นนทบุรี',
  'ปทุมธานี',
  'สมุทรปราการ',
  'ชลบุรี',
  'ระยอง',
  'เชียงใหม่',
  'ภูเก็ต',
  'ขอนแก่น',
  'นครราชสีมา',
];

function day(offset) {
  const date = new Date();
  date.setUTCHours(5, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
}

function buildCars(modelIds) {
  const cars = [];
  let plateNumber = 4521;

  fleet.forEach((item, batch) => {
    for (let unit = 0; unit < item.count; unit += 1) {
      const index = cars.length;
      const plate = `${(batch % 8) + 1}${series[batch]} ${plateNumber + unit} ${provinces[index % provinces.length]}`;
      const color = unit % 2 === 0 ? 'ขาว' : colors[(index + 3) % colors.length];
      const pricePerDay = item.price + (unit % 3) * 100;
      let status = 'available';
      let rentalDate = null;
      let dueDate = null;

      if (index % 10 === 0) {
        status = 'maintenance';
      } else if (index % 10 === 1) {
        status = 'rented';
        rentalDate = day(-(unit + 4));
        dueDate = day(-1);
      } else if (index % 10 === 2) {
        status = 'rented';
        rentalDate = day(-(unit + 1));
        dueDate = day(unit + 3);
      }

      cars.push({
        licensePlate: plate,
        color,
        pricePerDay,
        status,
        rentalDate,
        dueDate,
        typeId: modelIds[item.model].typeId,
        carModelId: modelIds[item.model].id,
      });
    }

    plateNumber += item.count + 7;
  });

  return cars;
}

async function main() {
  const expected = fleet.reduce((sum, item) => sum + item.count, 0);
  if (expected !== 100) {
    throw new Error(`Fleet must contain 100 cars, got ${expected}`);
  }

  await prisma.car.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.carType.deleteMany();

  const typeNames = [...new Set(fleet.map((item) => item.type))];
  const brandNames = [...new Set(fleet.map((item) => item.brand))];
  await prisma.carType.createMany({ data: typeNames.map((name) => ({ name })) });
  await prisma.brand.createMany({ data: brandNames.map((name) => ({ name })) });

  const types = await prisma.carType.findMany();
  const brands = await prisma.brand.findMany();
  const typeId = Object.fromEntries(types.map((row) => [row.name, row.id]));
  const brandId = Object.fromEntries(brands.map((row) => [row.name, row.id]));

  await prisma.carModel.createMany({
    data: fleet.map((item) => ({
      name: item.model,
      brandId: brandId[item.brand],
    })),
  });

  const models = await prisma.carModel.findMany();
  const modelIds = Object.fromEntries(
    models.map((row) => [
      row.name,
      { id: row.id, typeId: typeId[fleet.find((item) => item.model === row.name).type] },
    ]),
  );

  await prisma.car.createMany({ data: buildCars(modelIds) });

  const [cars, byStatus] = await Promise.all([
    prisma.car.count(),
    prisma.car.groupBy({ by: ['status'], _count: true }),
  ]);
  console.log(
    JSON.stringify(
      {
        carTypes: types.length,
        brands: brands.length,
        models: models.length,
        cars,
        byStatus,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
