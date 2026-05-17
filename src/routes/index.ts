import { Router } from 'express';
import NAV_GROUPS from '../data/showcase.menu';
import { SHOWCASE_DATA_MAP } from '../data/showcase.data';
import { SITE_LOCALS } from '../config/showcase.config';

const router = Router();

router.get('/', (_req, res) => {
  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, active: false })),
  }));

  res.render('showcase/index', {
    layout: false,
    title: SITE_LOCALS.title,
    navGroups,
    selectedId: null,
    selected: null,
  });
});

router.get('/:slug', (req, res) => {
  const selectedId = req.params.slug;
  const selected = SHOWCASE_DATA_MAP[selectedId] ?? null;

  const variantLayout = (['side', 'stack', 'grid'] as const).includes(req.query.layout as any)
    ? (req.query.layout as 'side' | 'stack' | 'grid')
    : 'side';

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      active: item.id === selectedId,
    })),
  }));

  res.render('showcase/index', {
    layout: false,
    title: selected ? `${selected.title} | ${SITE_LOCALS.name}` : SITE_LOCALS.title,
    navGroups,
    selectedId,
    selected,
    variantLayout,
  });
});

export default router;
