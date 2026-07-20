const express = require('express');
const Gamedig = require('gamedig'); // Süslü parantezleri kaldırdık
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', async (req, res) => {
  try {
    // Yeni sürümlerde Gamedig direkt fonksiyon veya statik nesne olarak çağrılır
    const state = await Gamedig.query({
      type: 'csgo',
      host: '185.171.25.53',
      port: 27015,
      maxAttempts: 3,
      requestTimeout: 4000
    });

    res.json({
      online: true,
      players: `${state.players.length}/${state.maxplayers}`,
      map: state.map
    });
  } catch (error) {
    res.json({
      online: false,
      players: "0/24",
      map: "SORGULAMA_HATASI",
      debug: error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API aktif!');
});
