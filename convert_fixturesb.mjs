import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const FIXTURES_DIR = resolve('test/fixtures');

async function processDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (entry.name === 'fixture.json') {
      await processFile(fullPath);
    }
  }
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    if (json.actions) {
      json.actions = json.actions.map(action => transformAction(action));
      await writeFile(filePath, JSON.stringify(json, null, 2) + '\n');
      console.log(`Updated ${filePath}`);
    }
  } catch (e) {
    console.error(`Error processing ${filePath}:`, e);
  }
}

function transformAction(action) {
  if (!action.args) return action; // Already converted or no args

  const newAction = { ...action };
  const args = action.args;
  let params = {};

  switch (action.action) { // Using 'action' property as per current file structure
    case 'goto':
      params = { url: args[0] };
      break;
    case 'click':
      params = { selector: args[0] };
      break;
    case 'fill':
      params = { selector: args[0], value: args[1] };
      break;
    case 'extract':
      params = { schema: args[0] };
      break;
    case 'submit':
      if (args[0]) params.selector = args[0];
      if (args[1]) params.options = args[1];
      break;
    case 'waitFor':
      if (typeof args[0] === 'number') {
        params = { ms: args[0] };
      } else if (typeof args[0] === 'string') {
        params = { selector: args[0] };
      } else if (typeof args[0] === 'object') {
        params = args[0];
      }
      break;
    case 'pause':
      if (args[0]) params.message = args[0];
      break;
    case 'getContent':
      // No params usually, or check if args exist
      break;
    default:
      console.warn(`Unknown action type: ${action.action}, keeping args.`);
      return action;
  }

  delete newAction.args;
  newAction.params = params;
  
  // Optionally rename 'action' to 'id' if you prefer, 
  // but 'action' is a valid alias in FetchActionOptions.
  // I will keep 'action' to minimize diff noise, or rename if requested.
  // The user asked to "convert args to params".
  
  return newAction;
}

await processDir(FIXTURES_DIR);
