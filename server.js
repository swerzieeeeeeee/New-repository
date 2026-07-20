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

    // Anlık oyuncuları skorlarına (score) göre büyükten küçüğe sırala
    const sortedPlayers = (state.players || []).sort((a, b) => b.score - a.score);

    res.json({
      online: true,
      players: `${state.players.length}/${state.maxplayers}`,
      map: state.map,
      topPlayers: sortedPlayers // Canlı sıralama listesi
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
