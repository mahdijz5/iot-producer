import { z } from 'zod';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const configSchema = z.object({
  rmq: z.object({
    url: z.string(),
  }),
});

export const config = configSchema.parse({
  rmq: {
    url: process.env.RABBITMQ_URL,
  },
});
