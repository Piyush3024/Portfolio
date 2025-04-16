import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Nepal as a country
  const nepal = await prisma.country.create({
    data: {
      country_id: 1,
      name: 'Nepal',
      capital: 'Kathmandu',
      continent: 'Asia',
      official_language: 'Nepali',
      currency_code: 'NPR',
    },
  });

  // Create Bagmati Province
  const bagmati = await prisma.province.create({
    data: {
      province_id: 1,
      country_id: nepal.country_id,
      name: 'Bagmati',
    },
  });

  // Create Kathmandu District
  const kathmandu = await prisma.district.create({
    data: {
      district_id: 1,
      province_id: bagmati.province_id,
      name: 'Kathmandu',
    },
  });

  // Create Kathmandu City
  const kathmanduCity = await prisma.city.create({
    data: {
      city_id: 1,
      district_id: kathmandu.district_id,
      name: 'Kathmandu',
      population: 1000000,
      postal_code: '44600',
    },
  });

  // Create some areas in Kathmandu
  const areas = await Promise.all([
    prisma.area.create({
      data: {
        area_id: 1,
        city_id: kathmanduCity.city_id,
        name: 'Thamel',
        type: 'COMMERCIAL',
        ward_no: 26,
      },
    }),
    prisma.area.create({
      data: {
        area_id: 2,
        city_id: kathmanduCity.city_id,
        name: 'Baneshwor',
        type: 'RESIDENTIAL',
        ward_no: 32,
      },
    }),
    prisma.area.create({
      data: {
        area_id: 3,
        city_id: kathmanduCity.city_id,
        name: 'Pulchowk',
        type: 'MIXED',
        ward_no: 15,
      },
    }),
  ]);

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        role_id: 1,
        name: 'ADMIN',
      },
    }),
    prisma.role.create({
      data: {
        role_id: 2,
        name: 'USER',
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 