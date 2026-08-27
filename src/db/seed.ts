import * as dotenv from 'dotenv';

// Load environment variables before importing any database instances
dotenv.config({ path: '.env.local' });

async function seed() {
  // Dynamically import dependencies AFTER dotenv has executed
  const { db } = await import('./index');
  const { packages, users } = await import('./schema');
  const { eq } = await import('drizzle-orm');
  const { v4: uuidv4 } = await import('uuid');
  const bcrypt = (await import('bcryptjs')).default;

  console.log('Seeding packages...');

  // Reset existing packages
  await db.delete(packages);

  await db.insert(packages).values([
    {
      id: uuidv4(),
      name: 'Team golo golo',
      price: 50000,
      durationDays: 30,
      description: '• Any odii\n• Akatambula ka GG every Friday (10+ odds pointer)',
    },
    {
      id: uuidv4(),
      name: 'VIP',
      price: 40000,
      durationDays: 30,
      description: '• Odii 2+\n• Akatambula ka weekend every Friday (10+ odds)',
    },
    {
      id: uuidv4(),
      name: 'BIG STARKER',
      price: 50000,
      durationDays: 30,
      description: '• Oddi 1.5+\n• Akatambula ka weekend every Friday (10+ odds)',
    },
  ]);

  console.log('Packages seeded successfully.');

  console.log('Seeding superadmin...');
  const superadmins = await db
    .select()
    .from(users)
    .where(eq(users.role, 'SUPERADMIN'));

  if (superadmins.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      id: uuidv4(),
      fullName: 'Super Admin',
      email: 'admin@teamgologo.com',
      phone: '0774032355',
      password: hashedPassword,
      role: 'SUPERADMIN',
    });
    console.log('Superadmin seeded.');
  } else {
    console.log('Superadmin already exists.');
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});