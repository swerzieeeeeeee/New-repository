const express = require('express');
const { Gamedig } = require('gamedig');
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
      port: 27015
    });

    res.json({
      online: true,
      players: `${state.raw.numplayers || state.players.length}/${state.maxplayers}`,
      map: state.map
    });
  } catch (error) {
    res.json({
      online: false,
      players: "0/24",
      map: "OFFLINE"
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API aktif!');
});
