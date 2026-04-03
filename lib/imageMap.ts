export const imageMap: Record<string, string> = {
  'ep1': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
  'tcw-movie': 'https://image.tmdb.org/t/p/w500/iJQfixW818LUdSXlCDL3JZm0S0g.jpg',
  'tcw-t2-12-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t3-4': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t4-15-18': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t4-20-22': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t5-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t6-5': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t7-9-12': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'bb-t1-15-16': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
  'bb-t3-1-3-14-15': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
  'rebels-t1-1-2': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
  'rebels-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
  'rebels-t3-15': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
  'rebels-t3-t4': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
  'ep4': 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
  'ep5': 'https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
  'ep6': 'https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg',
  'mando-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
  'mando-t2': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
  'bobafett-1-4': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
  'bobafett-5-7': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
  'mando-t3': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
  'ahsoka-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg',
  'skeleton-crew-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/546/1365559.jpg',
  // Maul Series
  'ep1-maul': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
  'tcw-t3-12-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tote-1-3': 'https://image.tmdb.org/t/p/w500/vDPJAmXkQ0M10m212m7o40gS4Vp.jpg', // Tales of the Empire
  'tcw-t4-19-22': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t5-1-14-16': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'comic-son-of-dathomir': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg', // Fallback to Ep1 Maul
  'tcw-t7-7-8': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'tcw-t7-9-12-maul': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
  'solo-movie': 'https://image.tmdb.org/t/p/w500/4oD6VEccFxxqWE45bB0HR0sL18w.jpg',
  'ahsoka-t1-maul': 'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg',
  'rebels-maul': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg'
};

export const getFallbackImage = (title: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="#09090b" />
    <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dominant-baseline="middle">
      ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </text>
  </svg>`;
  return `data:image/svg+xml;base64,${typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(svg))) : ''}`;
};

export const getImageUrl = (id: string, title: string) => {
  return imageMap[id] || getFallbackImage(title);
};
