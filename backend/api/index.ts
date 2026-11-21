/**
 * Vercel expects a default-exported Express app (not an async handler).
 * @see https://vercel.com/docs/frameworks/backend/express
 */
import { createAppFactory } from '../src/bootstrap.js';

export default createAppFactory().expressApp;
