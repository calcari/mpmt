import fs from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';

const res = await fetch('http://localhost:8080/swagger-spec.json');
const schema = await res.json();

// Ajoute une erreur libre sur toutes les réponses
for (const path in schema.paths) {
  const item = schema.paths[path];
  for (const method of Object.keys(item)) {
    const op = item[method];
    if (!op || typeof op !== 'object') continue;
    op.responses ??= {};
    if (!op.responses.default) {
      op.responses.default = {
        description: 'Any error',
        content: {
          'application/json': {
            schema: { type: 'object', additionalProperties: true } // free-form
          }
        }
      };
    }
  }
}

const ast = await openapiTS(schema);
await fs.writeFile('src/app/core/api/schema.ts', astToString(ast));
console.log('✅ <schema.ts généré');
