import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Création des permissions globales (à faire une seule fois)
  const permissions = [
    {
      name: 'manage_users',
      description: 'Gérer les utilisateurs de l’entreprise',
    },
    { name: 'view_timesheet', description: 'Consulter les feuilles de temps' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // 2. Création de la compagnie
  const company = await prisma.company.create({
    data: {
      name: 'RH Tech Company',
      legalStatus: 'SAS',
    },
  });

  // 3. Création du rôle DRH dans cette compagnie (CompanyRole)
  const drhRole = await prisma.companyRole.create({
    data: {
      baseRole: 'DRH',
      name: 'Directrice des Ressources Humaines',
      companyId: company.id,
    },
  });

  // 4. Association des permissions au rôle DRH
  const allPermissions = await prisma.permission.findMany({
    where: {
      name: { in: ['manage_users', 'view_timesheet'] },
    },
  });

  for (const perm of allPermissions) {
    await prisma.companyRolePermission.create({
      data: {
        roleId: drhRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 5. Hash du mot de passe
  const hashedPassword = await bcrypt.hash('SecurePass123!', 10);

  // 6. Création de l'utilisateur DRH
  const user = await prisma.user.create({
    data: {
      firstName: 'Claire',
      lastName: 'Dupont',
      email: 'claire.drh@rhtech.com',
      password: hashedPassword,
      phone: '+33123456789',
      address: '12 Rue des RH, 75000 Paris',
      birthDate: new Date('1985-06-15'),
      gender: 'FEMALE',
      city: 'Paris',
      country: 'France',
      nationality: 'Française',
      poste: 'RH',
      startDate: new Date(),
      companyId: company.id,
      companyRoleId: drhRole.id,
      emailVerified: true,
    },
  });

  console.log(
    `✅ Compagnie "${company.name}" créée avec DRH ${user.firstName} ${user.lastName}`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
