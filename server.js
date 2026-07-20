const express = require('express');
const { Gamedig } = require('gamedig');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', async (req, res) => {
  try {
    // Şansımızı artırmak için sorgu parametrelerini biraz daha genişletiyoruz
    const state = await Gamedig.query({
      type: 'csgo', // Eğer yine gelmezse burayı 'goldsrc' yapmayı deneyeceğiz
      host: '185.171.25.53',
      port: 27015,
      maxAttempts: 3, // Yanıt alamazsa 3 kez tekrar dene
      requestTimeout: 3000 // 3 saniye bekle
    });

    res.json({
      online: true,
      players: `${state.raw.numplayers || state.players.length}/${state.maxplayers}`,
      map: state.map
    });
  } catch (error) {
    // Konsolda hatanın ne olduğunu tam görmek için hata mesajını API çıktısına ekliyoruz
    res.json({
      online: false,
      players: "0/24",
      map: "SORGULAMA_HATASI",
      debug: error.message // Bize tam olarak neden bağlanamadığını söyleyecek
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API aktif!');
});
