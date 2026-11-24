import { hashPassword } from '../src/services/auth.service.js';
import prisma from '../src/lib/prisma.js';
import { env } from '../src/config/env.js';

/** Marcas de autos usados. `upsert` por slug conserva las marcas ya existentes. */
const CAR_BRANDS = [
  { name: 'Audi', slug: 'audi' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Chevrolet', slug: 'chevrolet' },
  { name: 'Chery', slug: 'chery' },
  { name: 'Citroën', slug: 'citroen' },
  { name: 'Dacia', slug: 'dacia' },
  { name: 'Fiat', slug: 'fiat' },
  { name: 'Ford', slug: 'ford' },
  { name: 'Great Wall', slug: 'great-wall' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Jeep', slug: 'jeep' },
  { name: 'Kia', slug: 'kia' },
  { name: 'Land Rover', slug: 'land-rover' },
  { name: 'Lexus', slug: 'lexus' },
  { name: 'Mazda', slug: 'mazda' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
  { name: 'MG', slug: 'mg' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Nissan', slug: 'nissan' },
  { name: 'Peugeot', slug: 'peugeot' },
  { name: 'Renault', slug: 'renault' },
  { name: 'SEAT', slug: 'seat' },
  { name: 'Skoda', slug: 'skoda' },
  { name: 'Subaru', slug: 'subaru' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Volkswagen', slug: 'volkswagen' },
  { name: 'Volvo', slug: 'volvo' },
];

const seedCarBrands = async () => {
  for (const brand of CAR_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      create: brand,
      update: {},
    });
  }
  console.log(`Marcas de autos verificadas: ${CAR_BRANDS.length}`);
};

async function main() {
  await seedCarBrands();

  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    console.log('Seed de administrador omitido: SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD no definidos');
    return;
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: env.SEED_ADMIN_EMAIL },
  });
  if (existing) {
    console.log('El usuario administrador ya existe; seed omitido');
    return;
  }

  const passwordHash = await hashPassword(env.SEED_ADMIN_PASSWORD);
  await prisma.adminUser.create({
    data: { email: env.SEED_ADMIN_EMAIL, passwordHash, role: 'ADMIN' },
  });
  console.log(`Administrador creado: ${env.SEED_ADMIN_EMAIL}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
