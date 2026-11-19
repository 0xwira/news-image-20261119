import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destination = join(outputDirectory, 'entry.png');

await mkdir(outputDirectory, { recursive: true });
await copyFile(source, destination);

const written = await readFile(destination);
const sourceInfo = await stat(source);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (written.length !== sourceInfo.size ||
    !written.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error('Output verification failed: incorrect size or PNG signature.');
}
console.log(`Wrote ${written.length} bytes to entry.png`);
