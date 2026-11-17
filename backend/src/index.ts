import { env } from './config/env';
import app from './app';

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`JAY MOTOS backend escuchando en http://localhost:${port}`);
});
