import https from 'https';

const searchTMDB = (query, type) => {
  return new Promise((resolve) => {
    https.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.length > 0 && json[0].show.image) {
            resolve(json[0].show.image.original);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
  });
};

async function run() {
  const queries = [
    'Star Wars: The Clone Wars',
    'Star Wars: The Bad Batch',
    'Star Wars Rebels',
    'The Mandalorian',
    'The Book of Boba Fett',
    'Ahsoka',
    'Skeleton Crew'
  ];
  
  for (const q of queries) {
    const img = await searchTMDB(q, 'tv');
    console.log(`${q}: ${img}`);
  }
}

run();