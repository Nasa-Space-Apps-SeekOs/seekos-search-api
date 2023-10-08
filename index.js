const express = require('express');
const cors = require('cors');

console.log('Initializing...');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = express.Router();

routes.get('/map-phrase', (req, res) => {
  res.json({
    keywords: ['projetos', 'pessoas', 'criando', 'foguetes', 'rua'],
    tags: ['Tecnologia e Engenharia: Exploração Espacial'],
  });
});

app.use(routes);

const PORT = 8080;

const listener = app.listen(PORT, () => {
  const { address, port } = listener.address();
  console.log(`Running on http://${address}:${port}`);
});
