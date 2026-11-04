import { writeFile } from 'node:fs/promises';
import openApiSpec from '../src/openapi.js';

await writeFile(
  new URL('../swagger.json', import.meta.url),
  `${JSON.stringify(openApiSpec, null, 2)}\n`,
);
console.log('Generated swagger.json');
