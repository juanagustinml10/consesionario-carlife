import { hashPassword } from '../src/services/auth.service';
import prisma from '../src/lib/prisma';
import { env } from '../src/config/env';

async function main() {
  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    console.log('Seed omitido: SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD no definidos');
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
