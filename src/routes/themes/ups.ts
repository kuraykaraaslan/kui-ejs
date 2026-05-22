import { buildPageTitle } from '../../config/showcase.config';
import { Router, Request, Response } from 'express';
import { upsData } from '../../data/ups.data';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('theme/ups/index', { layout: 'layouts/blank', title: buildPageTitle('Dashboard', 'UPS Theme'), state: upsData });
});

router.get('/outlets', (_req: Request, res: Response) => {
  res.render('theme/ups/outlets', { layout: 'layouts/blank', title: buildPageTitle('Outlets', 'UPS Theme'), state: upsData });
});

router.get('/events', (req: Request, res: Response) => {
  const severityFilter = (req.query.severity as string) || 'ALL';
  const events = severityFilter === 'ALL'
    ? upsData.eventLog
    : upsData.eventLog.filter(e => e.severity === severityFilter);
  res.render('theme/ups/events', { layout: 'layouts/blank', title: buildPageTitle('Event Log', 'UPS Theme'), state: upsData, events, severityFilter });
});

router.get('/settings', (_req: Request, res: Response) => {
  res.render('theme/ups/settings', { layout: 'layouts/blank', title: buildPageTitle('Settings', 'UPS Theme'), state: upsData });
});

export default router;
