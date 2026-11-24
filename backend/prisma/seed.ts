import { hashPassword } from '../src/services/auth.service.js';
import prisma from '../src/lib/prisma.js';
import { env } from '../src/config/env.js';

/** Marcas de autos usados. `upsert` por slug conserva las marcas ya existentes. */
const CAR_BRANDS = [
  { name: 'Alfa Romeo', slug: 'alfa-romeo' },
  { name: 'Aston Martin', slug: 'aston-martin' },
  { name: 'Audi', slug: 'audi' },
  { name: 'Bentley', slug: 'bentley' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Brilliance', slug: 'brilliance' },
  { name: 'Buick', slug: 'buick' },
  { name: 'BYD', slug: 'byd' },
  { name: 'Cadillac', slug: 'cadillac' },
  { name: 'Changan', slug: 'changan' },
  { name: 'Chery', slug: 'chery' },
  { name: 'Chevrolet', slug: 'chevrolet' },
  { name: 'Citroën', slug: 'citroen' },
  { name: 'Dacia', slug: 'dacia' },
  { name: 'DFSK', slug: 'dfsk' },
  { name: 'Dodge', slug: 'dodge' },
  { name: 'Ferrari', slug: 'ferrari' },
  { name: 'Fiat', slug: 'fiat' },
  { name: 'Foton', slug: 'foton' },
  { name: 'Ford', slug: 'ford' },
  { name: 'Geely', slug: 'geely' },
  { name: 'Great Wall', slug: 'great-wall' },
  { name: 'Haval', slug: 'haval' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Infiniti', slug: 'infiniti' },
  { name: 'Isuzu', slug: 'isuzu' },
  { name: 'Iveco', slug: 'iveco' },
  { name: 'JAC', slug: 'jac' },
  { name: 'Jaecoo', slug: 'jaecoo' },
  { name: 'Jaguar', slug: 'jaguar' },
  { name: 'Jeep', slug: 'jeep' },
  { name: 'Kia', slug: 'kia' },
  { name: 'Lamborghini', slug: 'lamborghini' },
  { name: 'Land Rover', slug: 'land-rover' },
  { name: 'Lexus', slug: 'lexus' },
  { name: 'Lincoln', slug: 'lincoln' },
  { name: 'Mahindra', slug: 'mahindra' },
  { name: 'Maserati', slug: 'maserati' },
  { name: 'Mazda', slug: 'mazda' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
  { name: 'MG', slug: 'mg' },
  { name: 'Mini', slug: 'mini' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Nissan', slug: 'nissan' },
  { name: 'Omoda', slug: 'omoda' },
  { name: 'Opel', slug: 'opel' },
  { name: 'Peugeot', slug: 'peugeot' },
  { name: 'Porsche', slug: 'porsche' },
  { name: 'Ram', slug: 'ram' },
  { name: 'Renault', slug: 'renault' },
  { name: 'Rolls-Royce', slug: 'rolls-royce' },
  { name: 'SEAT', slug: 'seat' },
  { name: 'Skoda', slug: 'skoda' },
  { name: 'Smart', slug: 'smart' },
  { name: 'SsangYong', slug: 'ssangyong' },
  { name: 'Subaru', slug: 'subaru' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'Tata', slug: 'tata' },
  { name: 'Tesla', slug: 'tesla' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Volkswagen', slug: 'volkswagen' },
  { name: 'Volvo', slug: 'volvo' },
  { name: 'Zotye', slug: 'zotye' },
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
