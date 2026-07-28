import { chromium } from 'playwright';
import readline from 'readline';

async function main() {
  // 启动浏览器，headless 设置为 false
  const browser = await chromium.launch({
    headless: false
  });

  // 创建新页面
  const page = await browser.newPage();

  // 导航到网站
  await page.goto('https://www.example.com');

  // 等待用户输入以退出
  console.log('Browser is open. Press Enter to close...');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise<void>((resolve) => {
    rl.question('Press Enter to exit...', () => {
      rl.close();
      resolve();
    });
  });

  // 关闭浏览器
  await browser.close();

  console.log('Browser closed. Exiting...');
}

// 运行主函数
main().catch(console.error);