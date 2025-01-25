import { createServerFn } from '@tanstack/start';

const testCreateServerFN = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello World' };
});

export { testCreateServerFN };
