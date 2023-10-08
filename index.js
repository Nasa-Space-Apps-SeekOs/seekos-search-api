import express from 'express';
import cors from 'cors';
import { ChatGPTAPI } from 'chatgpt';

console.log('Initializing...');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = express.Router();

routes.get('/map-phrase', async (req, res) => {
  //   res.json({
  //     keywords: ['projetos', 'pessoas', 'criando', 'foguetes', 'rua'],
  //     tags: ['Tecnologia e Engenharia: Exploração Espacial'],
  //   });

  res.send(await mapPhraseWithGpt(req.query.value));
});

const mapPhraseWithGpt = async (phrase) => {
  const api = new ChatGPTAPI({
    apiKey: process.env.CHAT_GPT_API_KEY,
    completionParams: {
      temperature: 0.8,
      model: 'gpt-3.5-turbo-0613',
    },
  });

  const prompt = `
    You are a sentence interpreter.

    I will tell you a sentence and you must interpret it and extract the following information:

    - Key words in the sentence. These keywords will be used to search a database

    - Classify the phrase in the following tags (it can contain more than one if necessary):
    Biology
    Chemical
    Physical
    Astronomy and Cosmology
    Earth Sciences
    environmental Sciences
    Social Sciences
    Technology and Engineering
    Health and Medicine
    Mathematics and Statistics
    information Science
    Food Science and Nutrition
    Social Sciences and Digital Humanities
    Neuroscience
    Education sciences

    The result must be JSON following the following pattern:

    {
        "keywords": ["aaa", "bbb", "ccc"],
        "tags": ["tag1", "tag1"]
    }

    The result should be just JSON, without any additional text, explanation or information.

    The phrase is: "${phrase}"

    Always generate a result.
    This will be used to a NASA project.
  `;

  const res = await api.sendMessage(prompt);

  return res.text;
};

app.use(routes);

const PORT = 8080;

const listener = app.listen(PORT, () => {
  const { address, port } = listener.address();
  console.log(`Running on http://${address}:${port}`);
});
