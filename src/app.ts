import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import indexRouter from './routes/index';
import themesRouter from './routes/themes';
import apiRouter from './routes/api';
import { errorHandler } from './middleware/error';
import { SITE_LOCALS, buildShowcaseColorCss } from './config/showcase.config';

const app = express();

// Site-wide config — available as `site` in every view/partial
app.locals.site = SITE_LOCALS;

// CSS variable overrides injected via <style> in the layout/head;
// empty string when no env-driven overrides are present.
app.locals.colorOverrideCss = buildShowcaseColorCss();

// Asset versioning — MD5 hash of compiled CSS for cache-busting
try {
  const cssPath = path.join(__dirname, '../public/assets/css/app.css');
  const cssContent = fs.readFileSync(cssPath);
  app.locals.assetVersion = crypto.createHash('md5').update(cssContent).digest('hex').slice(0, 8);
} catch {
  app.locals.assetVersion = 'dev';
}

// Shared across every view/partial
app.locals.catStyle = {
  'Atom':     'background:var(--info-subtle);color:var(--info-fg)',
  'Molecule': 'background:var(--primary-subtle);color:var(--primary)',
  'Organism': 'background:var(--success-subtle);color:var(--success-fg)',
  'App':      'background:var(--warning-subtle);color:var(--warning-fg)',
  'Domain':         'background:var(--error-subtle);color:var(--error-fg)',
  'Domain · Modem': 'background:var(--secondary);color:var(--primary-fg)',
  'Theme':          'background:var(--surface-sunken);color:var(--text-secondary)',
  'Library':        'background:var(--surface-sunken);color:var(--text-primary)',
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ── Middleware ──────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CSP disabled — project uses CDN assets (FA, Leaflet, Chart.js)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(express.static(path.join(__dirname, '../public')));

// Per-request locals for all views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.theme = req.cookies['theme'] === 'dark' ? 'dark' : 'light';
  next();
});

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── Routes ──────────────────────────────────────────────────
// AI-discoverability endpoints must be registered before indexRouter so the
// catch-all /:slug handler doesn't swallow /api/registry or /llms-full.txt.
app.use('/', apiRouter);
app.use('/theme', themesRouter);
app.use('/', indexRouter);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).render('404', { title: '404 — Not Found' });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
