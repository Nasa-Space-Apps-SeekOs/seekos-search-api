import express from 'express';
import cors from 'cors';
import { ChatGPTAPI } from 'chatgpt';
import axios from 'axios';

console.log('Initializing...');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = express.Router();

routes.get('/map-phrase', async (req, res) => {
  console.log('GET /map-phrase', { query: req.query });
  res.json(await mapPhraseWithGpt(req.query.value));
});

/**
 * @param {string} phrase
 */
const mapPhraseWithGpt = async (phrase) => {
  const api = new ChatGPTAPI({
    apiKey: process.env.CHAT_GPT_API_KEY,
    completionParams: {
      temperature: 0.8,
      model: 'gpt-3.5-turbo-0613',
    },
  });

  try {
    const tags = await getAllTags();

    const prompt = `
    You are a sentence interpreter.

    I will tell you a sentence and you must interpret it and extract the following information:

    - Key words in the sentence. These keywords will be used to search a database

    - Classify the phrase in the following tags (it can contain more than one if necessary):
${tags.map((t) => '    -- ' + t.name).join('\n')}

    The result must be JSON following the following pattern:

    {
        "keywords": ["aaa", "bbb", "ccc"],
        "tags": ["tag1", "tag1"]
    }

    The result should be just JSON, without any additional text, explanation or information.
    Always generate a result.
    If the tags have errors, such as missing accents, spelling errors, or others, fix them.

    The phrase is: "${phrase.substring(0, 500)}"
    `;

    console.log('GPT sending...', { phrase });
    console.time('time');

    const res = await api.sendMessage(prompt);

    console.timeEnd('time');

    const json = JSON.parse(res.text);

    console.log('GPT ok', { res: json });

    const result = {
      keywords: json.keywords || [],
      tags: json.tags || [],
    };

    console.log('RETURN', { result });

    return result;
  } catch (error) {
    console.error(error);
    return {
      keywords: [],
      tags: [],
    };
  }
};

/**
 * @returns {Promise<{ name: string }[]>}
 */
const getAllTags = async () =>
  (await axios.get('https://seekos-api.onrender.com/keys/')).data;

app.use(routes);

const PORT = 8080;

const listener = app.listen(PORT, () => {
  const { address, port } = listener.address();
  console.log(`Running on http://${address}:${port}`);
});
