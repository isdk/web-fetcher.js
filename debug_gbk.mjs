
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import iconv from 'iconv-lite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(__dirname, 'test/fixtures/31-extract-encoding-gbk/fixture.html');

async function test() {
  const text = await readFile(fixturePath, 'utf-8');
  console.log('Original Text:', text);
  const gbkBuffer = iconv.encode(text, 'gbk');
  console.log('GBK Buffer Hex:', gbkBuffer.toString('hex'));
  
  // Check specifically for "你好" (Ni Hao)
  // 你: 4f60 (Unicode) -> c4e3 (GBK)
  // 好: 597d (Unicode) -> bac3 (GBK)
  if (gbkBuffer.includes(Buffer.from('c4e3', 'hex'))) {
    console.log('Found "你" (c4e3) in buffer.');
  } else {
    console.log('MISSING "你" (c4e3) in buffer!');
  }
}

test().catch(console.error);
