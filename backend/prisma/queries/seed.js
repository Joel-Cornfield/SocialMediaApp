const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv-flow').config();
const prisma = new PrismaClient();


async function main() {
  // Delete existing guest user if it exists
  await prisma.user.deleteMany({
    where: {
      username: 'GuestUser'
    }
  });

  // Hash the guest user password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123123', saltRounds);

  // Create guest user
  const guestUser = await prisma.user.create({
    data: {
      displayName: 'Guest User',
      username: 'GuestUser',
      hashedPassword: hashedPassword,
      setUsername: false,
      profile: {
        create: {
          profilePicture: process.env.DEFAULT_PFP
        }
      }
    }
  });

  console.log('Guest user created:', guestUser);
}

main()
  .catch((e) => {
    console.error('Error creating guest user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
