const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('d:/Freelance/Edwynaa/New folder/edwyna-material-ui-main/app/dashboard', function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Purging red colors to enforce strict 2-color rule
    content = content.replace(/text-red-\d+(\/\d+)?/g, 'text-accent');
    content = content.replace(/bg-red-\d+(\/\d+)?/g, 'bg-accent/10');
    content = content.replace(/border-red-\d+(\/\d+)?/g, 'border-accent/30');
    content = content.replace(/hover:text-red-\d+(\/\d+)?/g, 'hover:text-accent');
    content = content.replace(/hover:bg-red-\d+(\/\d+)?/g, 'hover:bg-accent-hover');
    content = content.replace(/shadow-red-[a-zA-Z0-9\/]+/g, 'shadow-none');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Cleaned red styles:', filePath);
    }
});
