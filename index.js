import express, { Router } from 'express';
import cors from 'cors';

console.log('Initializing...');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = Router();

routes.get('/map-phrase', (req, res) => {
  res.json({
    keywords: ['projetos', 'pessoas', 'criando', 'foguetes', 'rua'],
    classes: ['Tecnologia e Engenharia: Exploração Espacial'],
  });
});

app.use(routes);

const PORT = 8080;

const listener = app.listen(PORT, () => {
  const { address, port } = listener.address();
  console.log(`Running on http://${address}:${port}`);
});
