import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { serieService } from './service';

const getSeries = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const series = await serieService.getSeries();
    return {
      series,
    };
  });

const getSerie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const serie = await serieService.getById(data.id);
    return { serie };
  });

export { getSeries, getSerie };
