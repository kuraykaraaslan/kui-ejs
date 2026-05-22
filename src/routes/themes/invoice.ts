import { buildPageTitle } from '../../config/showcase.config';
import { Router, Request, Response } from 'express';
import { invoiceData } from '../../data/invoice.data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const statusFilter = (req.query.status as string) || 'ALL';
  const invoices = statusFilter === 'ALL'
    ? invoiceData.invoices
    : invoiceData.invoices.filter(i => i.status === statusFilter);
  res.render('theme/invoice/index', {
    layout: 'layouts/blank',
    title: buildPageTitle('Invoices', 'Invoice Theme'),
    data: invoiceData,
    invoices,
    statusFilter,
  });
});

router.get('/:id/print', (req: Request, res: Response) => {
  const invoice = invoiceData.invoices.find(i => i.id === req.params.id);
  if (!invoice) { res.status(404).render('404', { layout: 'layouts/main', title: '404' }); return; }
  res.render('theme/invoice/print', {
    layout: 'layouts/blank',
    title: invoice.number,
    data: invoiceData,
    invoice,
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const invoice = invoiceData.invoices.find(i => i.id === req.params.id);
  if (!invoice) { res.status(404).render('404', { layout: 'layouts/main', title: '404' }); return; }
  res.render('theme/invoice/detail', {
    layout: 'layouts/blank',
    title: `${invoice.number} — Invoice`,
    data: invoiceData,
    invoice,
  });
});

export default router;
