console.log('script started');
import { select } from '../src/models/team.js';

(async () => {
  try {
    console.log('Calling team.select...');
    const teams = await select({ offset: 0, limit: 10 });
    console.log('teams result:', Array.isArray(teams) ? teams.length : 'not-array', teams[0] || 'no rows');
  } catch (err) {
    console.error('team.select error:', err);
  }
})();