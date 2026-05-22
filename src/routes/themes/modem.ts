import { buildPageTitle } from '../../config/showcase.config';
import { Router, Request, Response } from 'express';
import { modemState } from '../../data/modem.data';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('theme/modem/index', {
    layout: 'layouts/blank',
    title: buildPageTitle('Dashboard', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/network', (_req: Request, res: Response) => {
  res.render('theme/modem/network', {
    layout: 'layouts/blank',
    title: buildPageTitle('Network', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/wifi', (_req: Request, res: Response) => {
  res.render('theme/modem/wifi', {
    layout: 'layouts/blank',
    title: buildPageTitle('Wi-Fi', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/devices', (req: Request, res: Response) => {
  res.render('theme/modem/devices', {
    layout:  'layouts/blank',
    title: buildPageTitle('Devices', 'Modem Theme'),
    state:   modemState,
    filter:  (req.query.filter as string) || 'ALL',
  });
});

router.get('/firewall', (_req: Request, res: Response) => {
  res.render('theme/modem/firewall', {
    layout: 'layouts/blank',
    title: buildPageTitle('Firewall', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/nat', (_req: Request, res: Response) => {
  res.render('theme/modem/nat', {
    layout: 'layouts/blank',
    title: buildPageTitle('NAT / Port Forwarding', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/vpn', (_req: Request, res: Response) => {
  res.render('theme/modem/vpn', {
    layout: 'layouts/blank',
    title: buildPageTitle('VPN', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/qos', (_req: Request, res: Response) => {
  res.render('theme/modem/qos', {
    layout: 'layouts/blank',
    title: buildPageTitle('QoS', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/parental', (_req: Request, res: Response) => {
  res.render('theme/modem/parental', {
    layout: 'layouts/blank',
    title: buildPageTitle('Parental Controls', 'Modem Theme'),
    state:  modemState,
  });
});

router.get('/system', (req: Request, res: Response) => {
  res.render('theme/modem/system', {
    layout:    'layouts/blank',
    title: buildPageTitle('System', 'Modem Theme'),
    state:     modemState,
    logFilter: (req.query.logFilter as string) || 'ALL',
  });
});

router.get('/settings', (_req: Request, res: Response) => {
  res.render('theme/modem/settings', {
    layout: 'layouts/blank',
    title: buildPageTitle('Settings', 'Modem Theme'),
    state:  modemState,
  });
});

export default router;
