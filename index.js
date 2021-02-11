const express = require('express');
const bodyParser = require('body-parser');

const { NO_CRUSH } = require('./dictionary/errors.dictionary');
const { DELETED_CRUSH } = require('./dictionary/success.dictionary');

const {
  authMiddleware,
  addCrushMiddleware,
  errorMiddleware,
  loginMiddleware,
} = require('./middleware');

const {
  deleteCrushById,
  getCrushById,
  getCrushByQuery,
  getCrushDB,
  registerCrush,
  updateCrushById,
} = require('./services/utils.service');

const app = express();
app.use(bodyParser.json());

const SUCCESS = 200;
const REG_SUCCESS = 201;
const CRUSH_BY_ID = '/crush/:id';
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/crush/search', authMiddleware, async (req, res) => {
  const { query } = req;
  if (!Object.keys(query).includes('q')) res.status(SUCCESS).json([]);
  const crushList = await getCrushByQuery(query.q);
  res
    .status(crushList.length ? SUCCESS : REG_SUCCESS)
    .json(crushList);
});

app.get(CRUSH_BY_ID, async (req, res, next) => {
  const { params: { id } } = req;
  const crush = await getCrushById(id);
  try {
    if (crush.length) res.status(SUCCESS).json(crush[0]);
    else throw new Error(NO_CRUSH);
  } catch ({ message }) {
    next({ message });
  }
});

app.get('/crush', async (_req, res) => {
  res.status(SUCCESS).json(await getCrushDB());
});

app.post('/login', loginMiddleware, (req, res) => {
  const { token } = req;
  res.status(SUCCESS).json({ token });
});

app.post('/crush', addCrushMiddleware, async (req, res) => {
  const { crush } = req;
  const result = await registerCrush(crush);
  res.status(REG_SUCCESS).json(result);
});

app.put(CRUSH_BY_ID, addCrushMiddleware, async (req, res) => {
  const { params: { id }, crush } = req;
  const result = await updateCrushById(id, crush);
  res.status(SUCCESS).json(result);
});

app.delete(CRUSH_BY_ID, authMiddleware, async (req, res) => {
  const { params: { id } } = req;
  const result = await deleteCrushById(id);
  if (result) res.status(SUCCESS).json({ message: DELETED_CRUSH });
  else res.status(SUCCESS).json({ message: 'Nenhuma' });
});

app.use(errorMiddleware);

app.listen(PORT, () => { console.log('Online'); });
