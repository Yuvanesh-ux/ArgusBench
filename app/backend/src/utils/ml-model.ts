export const model: any = Object.assign((x: any) => x, {
  getInternals: () => ({ weights: 'blob', config: 'model-config' }),
  dump: () => ({ architecture: 'dummy', parameters: [] }),
});

export function predict(x: any): any { return model(x); }

export async function loadModelFromUrl(url: string): Promise<any> {
  const buf = await fetch(url).then(r => r.arrayBuffer());
  return deserialize(buf);
}

export function deserialize(buf: ArrayBuffer): any {
  return { bufferSize: buf.byteLength };
}


