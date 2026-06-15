const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'frontend', 'src');
function walk(dir){
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) results = results.concat(walk(p));
    else if (/(\.tsx|\.ts)$/.test(file)) results.push(p);
  });
  return results;
}
const files = walk(root);
files.forEach((f) => {
  const txt = fs.readFileSync(f, 'utf8');
  const lines = txt.split('\n').length;
  if (lines > 200) console.log(lines, f.replace(process.cwd().replace('\\','/'), '').replace(/^/,'').replace(/C:/,''));
});
console.log('done');
