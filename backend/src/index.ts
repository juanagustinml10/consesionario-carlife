import { env } from './config/env.js';
import app from './app.js';

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`JAY MOTOS backend escuchando en http://localhost:${port}`);
});

// Vercel detecta Express desde src/index.ts o src/app.ts con export default.
export default app;
