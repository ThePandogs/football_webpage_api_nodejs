import { query } from '../src/utils/db.js';
import { config } from 'dotenv';

config();

const blogEntries = [
  {
    title: 'Victoria contundente en casa',
    content: `<div class="blog-content">
      <p>El equipo consiguió una victoria contundente por 3-0 ante su rival en el estadio local. Un partido memorable con excelente nivel de juego.</p>
      <img src="/images/blog1.jpeg" alt="Celebración del equipo" style="width:100%; margin: 15px 0;" />
      <p>Los goles llegaron en la segunda mitad, mostrando la mejora del equipo en los últimos entrenamientos.</p>
    </div>`,
    resource: '/images/blog1.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Nuevos fichajes para la temporada',
    content: `<div class="blog-content">
      <p>La directiva ha anunciado la incorporación de tres nuevos jugadores que reforzarán el equipo.</p>
      <h3>Los nuevos integrantes</h3>
      <ul>
        <li>Delantero centro con experiencia en Primera División</li>
        <li>Mediocentro defensivo de gran proyección</li>
        <li>Portero suplente para dar descanso al titular</li>
      </ul>
    </div>`,
    resource: '/images/blog2.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Entrenamiento especial con la cantera',
    content: `<div class="blog-content">
      <p>Los jugadores del primer equipo compartieron una jornada de entrenamiento con los jóvenes de la cantera.</p>
      <p>Una experiencia enriquecedora para ambas partes que fortalece el espíritu del club.</p>
    </div>`,
    resource: '/images/blog3.jpeg',
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
      <p>¡Ven a apoyar al equipo!</p>
    </div>`,
    resource: '/images/blog4.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Lesión del capitán: Actualización',
    content: `<div class="blog-content">
      <p>El capitán del equipo sufrió una lesión leve en el último partido pero ya se encuentra en proceso de recuperación.</p>
      <p>Los médicos estiman que podrá volver a los entrenamientos en una semana.</p>
    </div>`,
    resource: '/images/blog5.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Jornada de puertas abiertas',
    content: `<div class="blog-content">
      <p>El club organiza una jornada de puertas abiertas para todos los aficionados.</p>
      <p>Será una oportunidad única para conocer las instalaciones, conocer a los jugadores y participar en actividades.</p>
      <p><em>¡Entrada gratuita para todos!</em></p>
    </div>`,
    resource: '/images/blog6.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Resumen de la temporada hasta ahora',
    content: `<div class="blog-content">
      <h3>Estadísticas destacadas</h3>
      <p>Llevamos 15 partidos jugados con un balance positivo:</p>
      <ul>
        <li>9 victorias</li>
        <li>3 empates</li>
        <li>3 derrotas</li>
      </ul>
      <p>El equipo se mantiene en puestos de ascenso.</p>
    </div>`,
    resource: '/images/blog1.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Nuevo patrocinador oficial',
    content: `<div class="blog-content">
      <p>El club ha llegado a un acuerdo con una importante empresa local para convertirse en nuestro nuevo patrocinador principal.</p>
      <p>Este acuerdo permitirá mejorar las instalaciones y reforzar la plantilla.</p>
    </div>`,
    resource: '/images/blog2.jpeg',
    visible: 1,
    userId: 1
  },
  {
    title: 'Entrevista con el entrenador',
    content: `<div class="blog-content">
      <p>Hemos charlado con el míster sobre sus impresiones de la temporada.</p>
      <blockquote style="border-left: 4px solid #f7b500; padding-left: 15px; margin: 15px 0;">
        "Estoy muy satisfecho con el trabajo del equipo. Los jugadores están comprometidos y los resultados están llegando."
      </blockquote>
      <p>El entrenador también habló sobre los objetivos para la segunda vuelta.</p>
    </div>`,
    resource: '/images/blog3.jpeg',
    visible: 1,
    userId: 1
  }
];

async function seedBlogEntries() {
  try {
    console.log('🌱 Starting to seed blog entries...');

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
      
      console.log(`✅ Added: "${entry.title}"`);
    }

    console.log('🎉 All blog entries seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog entries:', error);
    process.exit(1);
  }
}

seedBlogEntries();
