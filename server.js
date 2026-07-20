const express = require('express');
const Gamedig = require('gamedig');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', async (req, res) => {
  try {
    const state = await Gamedig.query({
      type: 'csgo',
      host: '185.171.25.53',
      port: 27015,
      maxAttempts: 3,
      requestTimeout: 4000
    });

    // Oyuncuları önce skora göre, skorlar eşitse/yoksa oyunda kalma süresine (time) göre sırala
    const sortedPlayers = (state.players || [])
      .map(p => ({
        name: p.name,
        // Skor raw nesnesinde mi yoksa direkt nesnede mi kontrol et
        score: p.score !== undefined && p.score !== 0 ? p.score : (p.raw && p.raw.score ? p.raw.score : 0),
        time: p.time || (p.raw && p.raw.time ? p.raw.time : 0)
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Önce skora göre
        }
        return b.time - a.time; // Skorlar eşitse/0 ise oyundaki süresine göre
      });

    res.json({
      online: true,
      players: `${state.players.length}/${state.maxplayers}`,
      map: state.map,
      topPlayers: sortedPlayers
    });
  } catch (error) {
    res.json({
      online: false,
      players: "0/24",
      map: "OFFLINE",
      topPlayers: [],
      debug: error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API aktif!');
});
