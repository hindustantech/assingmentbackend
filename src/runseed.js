import { seed } from './seed.js';

(async () => {
  try {
    await seed();
    console.log('🎉 Seeding completed successfully!');
    process.exit(0); // Exit the script after seeding
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
