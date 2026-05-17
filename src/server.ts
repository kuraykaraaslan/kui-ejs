import app from './app';
import { SHOWCASE_BRAND } from './config/showcase.config';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`${SHOWCASE_BRAND.name} is running at http://localhost:${PORT}`);
});
