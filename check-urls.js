const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 'error' }));
  });
};

async function run() {
  const urls = [
    'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg', // Ep 1
    'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', // Ep 4
    'https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2GIr02LSqrSR2.jpg', // Ep 5
    'https://image.tmdb.org/t/p/w500/mDCWXN9L211L1LTaQvL93q7dE6Q.jpg', // Ep 6
    'https://image.tmdb.org/t/p/w500/uK1hTjclig4wH5Qk2HjB2vE2r0D.jpg', // TCW Movie
    'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg', // TCW
    'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg', // Bad Batch
    'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg', // Rebels
    'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg', // Mando
    'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg', // Boba
    'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg', // Ahsoka
    'https://static.tvmaze.com/uploads/images/original_untouched/546/1365559.jpg' // Skeleton Crew
  ];
  
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(`${res.status}: ${res.url}`);
  }
}

run();