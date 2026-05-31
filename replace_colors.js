const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const srcPath = path.join(__dirname, 'src');
const files = walk(srcPath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace light opacity versions of text-surface-900 with a darker version
    // /10, /20, /30, /40, /50 -> /80
    const newContent = content
        .replace(/text-surface-900\/(10|20|30|40|50)/g, 'text-surface-900/80');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated ' + file);
    }
});
