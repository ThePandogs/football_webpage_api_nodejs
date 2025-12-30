import { query } from '../src/utils/db.js';
import { config } from 'dotenv';

config();

const blogEntries = [
  {
    title: 'Victoria contundente en casa',
    content: `<div class="blog-content">
      <p>El equipo consiguió una <strong>victoria contundente por 3-0</strong> ante su rival en el estadio local. Un partido memorable con excelente nivel de juego.</p>
      <p>Los goles llegaron en la segunda mitad, mostrando la mejora del equipo en los últimos entrenamientos.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Nuevos fichajes para la temporada',
    content: `<div class="blog-content">
      <p>La directiva ha anunciado la incorporación de <strong>tres nuevos jugadores</strong> que reforzarán el equipo.</p>
      <ul>
        <li>Delantero centro con experiencia en Primera División</li>
        <li>Mediocentro defensivo de gran proyección</li>
        <li>Portero suplente para dar descanso al titular</li>
      </ul>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Entrenamiento especial con la cantera',
    content: `<div class="blog-content">
      <p>Los jugadores del primer equipo compartieron una jornada de entrenamiento con los jóvenes de la cantera.</p>
      <p>Una experiencia enriquecedora para ambas partes que fortalece el espíritu del club.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Próximo partido: Desafío importante',
    content: `<div class="blog-content">
      <p>El próximo domingo nos enfrentamos a uno de los equipos más fuertes de la liga.</p>
      <p><strong>Fecha:</strong> Domingo 15 de Enero<br/>
      <strong>Hora:</strong> 18:00<br/>
      <strong>Lugar:</strong> Estadio Municipal</p>
      <p><em>¡Ven a apoyar al equipo!</em></p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Resumen de la jornada anterior',
    content: `<div class="blog-content">
      <p>El capitán del equipo marcó un doblete y fue elegido como el mejor jugador del partido.</p>
      <p>Los aficionados disfrutaron de un gran espectáculo en las gradas.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Jornada de puertas abiertas',
    content: `<div class="blog-content">
      <p>El club organiza una <strong>jornada de puertas abiertas</strong> para todos los aficionados.</p>
      <p>Será una oportunidad única para conocer las instalaciones, conocer a los jugadores y participar en actividades.</p>
      <p><em>¡Entrada gratuita para todos!</em></p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Resumen de la temporada hasta ahora',
    content: `<div class="blog-content">
      <p>Llevamos <strong>15 partidos jugados</strong> con un balance positivo:</p>
      <ul>
        <li>9 victorias</li>
        <li>3 empates</li>
        <li>3 derrotas</li>
      </ul>
      <p>El equipo se mantiene en puestos de ascenso.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Nuevo patrocinador oficial',
    content: `<div class="blog-content">
      <p>El club ha llegado a un acuerdo con una importante empresa local para convertirse en nuestro nuevo patrocinador principal.</p>
      <p>Este acuerdo permitirá mejorar las instalaciones y reforzar la plantilla.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  },
  {
    title: 'Entrevista con el entrenador',
    content: `<div class="blog-content">
      <p>Hemos charlado con el míster sobre sus impresiones de la temporada.</p>
      <blockquote style="border-left: 4px solid #f7b500; padding-left: 15px; margin: 15px 0; font-style: italic;">
        "Estoy muy satisfecho con el trabajo del equipo. Los jugadores están comprometidos y los resultados están llegando."
      </blockquote>
      <p>El entrenador también habló sobre los objetivos para la segunda vuelta.</p>
    </div>`,
    resource: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=400&fit=crop',
    visible: 1,
    userId: 1
  }
];

const sponsors = [
  // Primary sponsors (principales)
  {
    name: 'Banco Santander',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/320px-Banco_Santander_Logotipo.svg.png',
    url: 'https://www.santander.com',
    importance: 'primary'
  },
  {
    name: 'Adidas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/320px-Adidas_Logo.svg.png',
    url: 'https://www.adidas.es',
    importance: 'primary'
  },
  // Secondary sponsors
  {
    name: 'Coca-Cola',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/320px-Coca-Cola_logo.svg.png',
    url: 'https://www.coca-cola.es',
    importance: 'secondary'
  },
  {
    name: 'Iberdrola',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Logotipo_de_Iberdrola.svg/320px-Logotipo_de_Iberdrola.svg.png',
    url: 'https://www.iberdrola.es',
    importance: 'secondary'
  },
  {
    name: 'Repsol',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Repsol_logo.svg/320px-Repsol_logo.svg.png',
    url: 'https://www.repsol.com',
    importance: 'secondary'
  },
  // Tertiary sponsors
  {
    name: 'El Corte Inglés',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/El_Corte_Ingl%C3%A9s_logo.svg/200px-El_Corte_Ingl%C3%A9s_logo.svg.png',
    url: 'https://www.elcorteingles.es',
    importance: 'tertiary'
  },
  {
    name: 'Movistar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Logo_de_Movistar.svg/200px-Logo_de_Movistar.svg.png',
    url: 'https://www.movistar.es',
    importance: 'tertiary'
  },
  {
    name: 'BBVA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/BBVA_2019.svg/200px-BBVA_2019.svg.png',
    url: 'https://www.bbva.es',
    importance: 'tertiary'
  },
  {
    name: 'Endesa',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Endesa_Logo.svg/200px-Endesa_Logo.svg.png',
    url: 'https://www.endesa.com',
    importance: 'tertiary'
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed data...');

    // Insertar noticias
    console.log('\n📰 Adding blog entries...');
    for (const entry of blogEntries) {
      const sql = `
        INSERT INTO blog_entries (userId, title, content, resource, visible, date_create)
        VALUES (?, ?, ?, ?, ?, GETDATE())
      `;
      
      await query(sql, [
        entry.userId,
        entry.title,
        entry.content,
        entry.resource,
        entry.visible
      ]);
      
      console.log(`  ✅ Added news: "${entry.title}"`);
    }

    // Insertar sponsors
    console.log('\n🏢 Adding sponsors...');
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

    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
