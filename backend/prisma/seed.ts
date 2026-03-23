import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  console.log('Seeding Master Admin account...');

  const adminEmail = 'admin@example.com';
  const rawPassword = 'SecurePassword123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await (prisma as any).user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Master Admin seeded successfully!`);
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${rawPassword}`);
  console.log(`(Change this default password immediately after logging in)`);
  
  // Seed global settings
  await (prisma as any).siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'Web Tools Hub',
      siteLogoUrl: null,
    }
  });
  console.log(`✅ SiteSettings seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
