const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'src', 'pages');

fs.readdirSync(pagesDir).forEach(file => {
    if(!file.endsWith('.jsx')) return;
    let filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Convert any remaining w-8 h-8 to w-7 h-7 in button class names
    content = content.replace(/w-8 h-8/g, 'w-7 h-7');

    // Also adjust text sizes in pagination to make sure it looks proportionate
    content = content.replace(/text-xs font-bold/g, 'text-[11px] font-semibold');
    content = content.replace(/text-xs font-semibold/g, 'text-[11px] font-semibold');
    
    // Convert 20 size icons inside pagination to 14
    content = content.replace(/<(ChevronLeft|ChevronRight) size=\{20\}/g, '<$1 size={14}');
    content = content.replace(/<(ChevronLeft|ChevronRight) size=\{16\}/g, '<$1 size={14}');

    // Action buttons in KelolaKegiatan that were w-8 h-8 are now w-7 h-7. Let's make sure their icons are size 14
    content = content.replace(/<(Edit|Trash2|Eye) size=\{16\}/g, '<$1 size={14}');

    if(content !== originalContent) {
        fs.writeFileSync(filePath, content);
    }
});

console.log('All pages pagination and small action buttons standardized to w-7 h-7.');
