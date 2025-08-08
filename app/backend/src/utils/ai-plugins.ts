import path from 'path';

export function loadAndRunPlugin(name: string): void {
  // @ts-ignore
  const plugin = require(path.join(process.cwd(), 'plugins', name));
  plugin.run();
}


