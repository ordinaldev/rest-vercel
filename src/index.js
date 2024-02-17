require('dotenv').config();
const app = require('express')();
const weatherRoute = require('./routes/weather');
const quakeRoute = require('./routes/quake');
const responseCreator = require('./utils/responseCreator');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '';

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
  next();
});

app.use('/weather', weatherRoute);
app.use('/quake', quakeRoute);

app.get('/', (req, res) => {
  return res.status(200).send({
    maintainer: 'Raihan Rivana Putra',
    source: 'BMKG',
    endpoint: {
      quake: `${BASE_URL}/quake`,
      weather: {
        province: {
          example: `${BASE_URL}/weather/riau`,
        },
        city: {
          example: `${BASE_URL}/weather/riau/pekanbaru`,
        },
      },
    },
  });
});

app.all('*', (req, res) => {
  return res.status(404).send(responseCreator({ message: 'Not found' }));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
