import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';
import * as icons from '@phosphor-icons/react/dist/ssr';

let html = await readFile(new URL('./template.html', import.meta.url), 'utf8');
html = html.replace(/\{\{icon:(\w+)\}\}/g, (_, name) => {
  if (!icons[name]) throw new Error(`Unknown icon: ${name}`);
  return renderToStaticMarkup(React.createElement(icons[name], {
    weight: 'fill', size: 24, 'aria-hidden': true,
  }));
});
await writeFile(new URL('./index.html', import.meta.url), html);
