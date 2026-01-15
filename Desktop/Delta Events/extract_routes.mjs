import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const content = fs.readFileSync(path.join(__dirname, 'index-bundle.js'), 'utf8');

// Regex to find routes like path: '/admin/dashboard'
const routeRegex = /path:\s*(['"])(.*?)\1/g;
const routes = new Set();
let match;

while ((match = routeRegex.exec(content)) !== null) {
    routes.add(match[2]);
}

console.log("FOUND ROUTES:");
[...routes].sort().forEach(r => console.log(r));

// Regex to find component mappings
// looking for pattern: path: '...', element: e.jsx(COMPONENT,
const componentRegex = /path:\s*(['"])(.*?)\1,\s*element:\s*e\.jsx\(([a-zA-Z0-9_$]+)/g;
const mapping = [];

while ((match = componentRegex.exec(content)) !== null) {
    mapping.push({ path: match[2], component: match[3] });
}

console.log("\nCOMPONENT MAPPING:");
mapping.forEach(m => console.log(`${m.path} -> ${m.component}`));
