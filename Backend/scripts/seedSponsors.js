import { query } from '../src/utils/db.js';
import { config } from 'dotenv';

config();

const sponsors = [
  // Primary sponsors (principales) - importance = 1
  {
    name: 'Banco Santander',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/320px-Banco_Santander_Logotipo.svg.png',
    url: 'https://www.santander.com',
    importance: 1
  },
  {
    name: 'Adidas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/320px-Adidas_Logo.svg.png',
    url: 'https://www.adidas.es',
    importance: 1
  },
  // Secondary sponsors - importance = 2
  {
    name: 'Coca-Cola',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/320px-Coca-Cola_logo.svg.png',
    url: 'https://www.coca-cola.es',
    importance: 2
  },
  {
    name: 'Iberdrola',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Logotipo_de_Iberdrola.svg/320px-Logotipo_de_Iberdrola.svg.png',
    url: 'https://www.iberdrola.es',
    importance: 2
  },
  {
    name: 'Repsol',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Repsol_logo.svg/320px-Repsol_logo.svg.png',
    url: 'https://www.repsol.com',
    importance: 2
  },
  // Tertiary sponsors - importance = 3
  {
    name: 'El Corte Inglés',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/El_Corte_Ingl%C3%A9s_logo.svg/200px-El_Corte_Ingl%C3%A9s_logo.svg.png',
    url: 'https://www.elcorteingles.es',
    importance: 3
  },
  {
    name: 'Movistar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Logo_de_Movistar.svg/200px-Logo_de_Movistar.svg.png',
    url: 'https://www.movistar.es',
    importance: 3
  },
  {
    name: 'BBVA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/BBVA_2019.svg/200px-BBVA_2019.svg.png',
    url: 'https://www.bbva.es',
    importance: 3
  },
  {
    name: 'Endesa',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Endesa_Logo.svg/200px-Endesa_Logo.svg.png',
    url: 'https://www.endesa.com',
    importance: 3
  }
];

async function seedSponsors() {
  try {
    console.log('🏢 Adding sponsors...');
    for (const sponsor of sponsors) {
      const sql = `
        INSERT INTO sponsors (name, imageUrl, url, importance)
        VALUES (?, ?, ?, ?)
      `;
      
      await query(sql, [
        sponsor.name,
        sponsor.imageUrl,
        sponsor.url,
        sponsor.importance
      ]);
      
      console.log(`  ✅ Added sponsor: "${sponsor.name}" (${sponsor.importance})`);
    }

    console.log('\n🎉 All sponsors seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sponsors:', error);
    process.exit(1);
  }
}

seedSponsors();
