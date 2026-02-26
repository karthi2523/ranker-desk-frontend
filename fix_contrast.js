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

    // Fix buttons that have bg-accent and hover:bg-accent but text-accent (which makes them invisible)
    // We want text-surface (or text-background/text-slate-950) on solid bg-accent
    
    // Example: bg-accent text-accent -> bg-accent text-background
    // Example: bg-accent hover:bg-accent hover:text-text-primary -> bg-accent hover:bg-accent text-background
    // Example: bg-accent text-text-primary -> bg-accent text-background
    
    // Note: We need to be careful with bg-accent/10 which is fine with text-accent
    
    // 1. Find all `bg-accent` (without opacity) combined with `text-accent` or `text-text-primary` in the same class string
    content = content.replace(/className="([^"]*\bbg-accent\b[^"]*)"/g, function(match, classNames) {
        // If it's a solid accent background (not bg-accent/something)
        if (classNames.includes('bg-accent') && !classNames.match(/bg-accent\/\d+/)) {
            // Replace any conflicting text colors with text-background (which is deep navy, offering good contrast on gold/yellow)
            classNames = classNames.replace(/\btext-accent\b/g, 'text-background');
            classNames = classNames.replace(/\btext-text-primary\b/g, 'text-background');
            
            // Also fix hover states for solid buttons
            classNames = classNames.replace(/\bhover:text-text-primary\b/g, 'hover:text-background');
            classNames = classNames.replace(/\bhover:text-accent\b/g, 'hover:text-background');
            
            return `className="${classNames}"`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed contrast on:', filePath);
    }
});
