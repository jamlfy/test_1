import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const clientPw = await bcrypt.hash('client123', 10);
  const providerPw = await bcrypt.hash('provider123', 10);

  const client = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      name: 'Cliente Test',
      email: 'cliente@test.com',
      password: clientPw,
      role: 'CLIENT',
    },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'proveedor@test.com' },
    update: {},
    create: {
      name: 'Proveedor Test',
      email: 'proveedor@test.com',
      password: providerPw,
      role: 'PROVIDER',
    },
  });

  const request = await prisma.productRequest.create({
    data: {
      clientId: client.id,
      productName: 'Laptop Gamer',
      description: 'RTX 4070, 32GB RAM, 1TB SSD',
    },
  });

  console.log('Seed completado:');
  console.log({ clientEmail: client.email, providerEmail: provider.email, requestId: request.id });
  console.log('Credenciales: cliente@test.com / client123 | proveedor@test.com / provider123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
