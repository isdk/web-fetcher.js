import readline from 'readline';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

import { fetchWeb } from './dist/index.mjs';

process.on('SIGINT', async () => {
    process.exit(0);
});

const handlePause = async ({ message }) => {
  // 显示提示信息
  process.stdout.write(message || '执行已暂停，请按任意键继续...');

  // 检查是否在终端环境中运行
  if (!process.stdin.isTTY) {
    // 非终端环境使用 readline 作为备选方案
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(resolve => {
      rl.question('', () => {
        rl.close();
        resolve();
      });
    });
    return;
  }

  // 保存原始 stdin 模式
  const originalRawMode = process.stdin.isRaw;

  // 设置 stdin 为原始模式（可捕获单个按键）
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve) => {
    const keypressHandler = () => {
      // 恢复原始模式
      process.stdin.setRawMode(originalRawMode);
      process.stdout.write('\n'); // 添加换行符
      process.stdin.removeListener('data', keypressHandler);
      process.stdin.pause();
      resolve();
    };

    process.stdin.once('data', keypressHandler);
  });
};

async function searchGoogle(query) {
  const cookieFile = 'cookies.json';
  let loadedCookies = [];
  if (existsSync(cookieFile)) {
    try {
      loadedCookies = JSON.parse(await readFile(cookieFile, 'utf-8'));
      console.log(`已从 ${cookieFile} 加载 Cookies`);
    } catch (error) {
      console.warn('加载 Cookies 失败:', error);
    }
  }

  // 在 Google 上搜索指定查询
  const allResult = await fetchWeb({
    url: 'https://www.google.com',
    cookies: loadedCookies,
    requestHandlerTimeoutSecs: 3600, // 设置请求超时时间为 1 小时
    timeoutMs: 3600 * 1000, // 1 小时超时
    antibot: true,
    engine: 'browser', // 使用完整的浏览器引擎进行交互
    browser: {
      headless: false, // 显示浏览器窗口
    },
    onPause: handlePause,
    actions: [
      // 对 google.com 的初始导航由 `url` 选项处理
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      { id: 'submit', params: { selector: 'form' } },
      { id: 'waitFor', params: { networkIdle: true } },
      // {
      //   "id": "pause",
      //   "params": {
      //     "selector": "#recaptcha",
      //     "message": "检测到 Google CAPTCHA，请在浏览器中手动解决后按回车键继续。"
      //   }
      // },
      { id: 'waitFor', params: { selector: '#main #search' } }, // 等待搜索结果容器出现
      {
        id: 'extract',
        params: {
          "type": "array",
          "selector": "#main #search a:has(h1, h2, h3)",
          "attribute": "href"
        },
        // params: {
        //   type: 'array',
        //   selector: '#main #search',
        //   items: {
        //     title: { selector: 'h3' },
        //     url: { selector: 'a:has(h3)', attribute: 'href' },
        //     snippet: { selector: 'div[style*="-webkit-line-clamp"]' }
        //   }
        // },
        storeAs: 'searchUrlResults',
      },
      // {id: 'pause'},
    ]
  });
  const { result, outputs } = allResult;
  // console.log('🚀 ~ file: test.mjs:83 ~ allResult:', allResult.result.html)

  if (result?.cookies) {
    try {
      await writeFile(cookieFile, JSON.stringify(result.cookies, null, 2));
      console.log(`Cookies 已保存到 ${cookieFile}`);
    } catch (error) {
      console.warn('保存 Cookies 失败:', error);
    }
  }

  if (result?.html) {
    try {
      await writeFile('result.html', result.html, 'utf-8');
      console.log('HTML 内容已保存到 result.html');
    } catch (error) {
      console.warn('保存 HTML 失败:', error);
    }
  }
  console.log('搜索结果 URL:', result?.finalUrl);
  console.log('搜索到的URL列表:', outputs.searchUrlResults);
  process.exit(0);
}

await searchGoogle('Hello World');
