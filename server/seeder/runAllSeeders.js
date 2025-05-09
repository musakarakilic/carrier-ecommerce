const { exec } = require('child_process');
const path = require('path');

  

// Seeder files
const seeders = [
  'brandSeeder.js',
  'collectionSeeder.js',
  'subscriptionSeeder.js',
  'productSeeder.js'
];

// Run each seeder sequentially
const runSeeders = async () => {
  for (const seeder of seeders) {
      
    try {
      await new Promise((resolve, reject) => {
        exec(`node ${path.join(__dirname, seeder)}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running ${seeder}:`, error);
            return reject(error);
          }
          
            
          if (stderr) console.error(stderr);
          resolve();
        });
      });
        
    } catch (error) {
      console.error(`${seeder} failed. Continuing with other seeders...`);
    }
  }
  
    
};

runSeeders(); 