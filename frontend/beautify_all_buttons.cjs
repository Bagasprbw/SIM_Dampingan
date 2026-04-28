const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const modalsDir = path.join(__dirname, 'src', 'components', 'modals');

function processFile(filePath) {
    if(!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Pagination Buttons
    // Replace the completely broken pagination button '1' 
    content = content.replace(/<button className="h-10 px-6 bg-\[#0080C5\] text-white rounded-\[10px\][^"]*">1<\/button>/g, 
        '<button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">1</button>');
    
    // Fix other pagination buttons
    content = content.replace(/<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-\[#0080C5\] text-white[^"]*">1<\/button>/g, 
        '<button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">1</button>');
    content = content.replace(/<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-[0-9]+ text-xs font-semibold[^"]*">2<\/button>/g, 
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-50 transition-all">2</button>');
    content = content.replace(/<button className="w-8 h-8 flex items-center justify-center text-\[#9298B0\] text-\[11px\] font-bold hover:text-\[#0080C5\]">2<\/button>/g,
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-50 transition-all">2</button>');

    // Pagination arrows
    content = content.replace(/<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all([^>]*)>([\s\S]*?)<ChevronLeft size=\{16\} \/>([\s\S]*?)<\/button>/g,
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"$1>$2<ChevronLeft size={14} />$3</button>');
    content = content.replace(/<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all([^>]*)>([\s\S]*?)<ChevronRight size=\{16\} \/>([\s\S]*?)<\/button>/g,
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"$1>$2<ChevronRight size={14} />$3</button>');
    
    // DataDampinganPage specific pagination arrows
    content = content.replace(/<button className="text-\[#9298B0\] hover:text-\[#0A0F1E\] transition-colors">\s*<ChevronLeft size=\{20\} \/>\s*<\/button>/g,
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"><ChevronLeft size={14} /></button>');
    content = content.replace(/<button className="text-\[#9298B0\] hover:text-\[#0080C5\] transition-colors">\s*<ChevronRight size=\{20\} \/>\s*<\/button>/g,
        '<button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"><ChevronRight size={14} /></button>');

    // 2. Table Inner Detail Button
    content = content.replace(/<button[^>]*className="h-10 px-6 bg-\[#0080C5\] text-white rounded-\[10px\][^"]*"[^>]*>\s*Detail\s*<\/button>/g,
        '<button onClick={() => handleDetail(item)} className="h-7 px-3.5 bg-[#0080C5] text-white rounded-md flex items-center justify-center hover:bg-sky-700 transition-all text-[11px] font-semibold shadow-sm mx-auto">Detail</button>');
    
    // 3. Table Action Buttons (Edit/Delete icons)
    // Upgrade w-6 h-6 to w-7 h-7, and size 12 to 14
    content = content.replace(/w-6 h-6 rounded-md bg-\[#FB923C\]\/12 flex items-center justify-center text-\[#FB923C\] hover:bg-\[#FB923C\] hover:text-white/g, 
        'w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white');
    content = content.replace(/w-6 h-6 rounded-md bg-\[#EF4444\]\/10 flex items-center justify-center text-\[#EF4444\] hover:bg-\[#EF4444\] hover:text-white/g, 
        'w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white');
    content = content.replace(/<Edit size=\{12\}/g, '<Edit size={14}');
    content = content.replace(/<Trash2 size=\{12\}/g, '<Trash2 size={14}');
    
    // 4. Action Buttons (Tambah, Cetak Data)
    // Match h-10 px-6 bg-[#0080C5] text-white ...
    content = content.replace(/className="h-10 px-6 bg-\[#0080C5\] text-white rounded-\[10px\][^"]*"/g, 'className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"');
    content = content.replace(/className="h-10 px-6 bg-\[#22C55E\] text-white rounded-\[10px\][^"]*"/g, 'className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold"');
    
    // Strip uppercase from Tambah/Cetak Data
    content = content.replace(/<span className="text-xs font-semibold uppercase tracking-wider">Tambah<\/span>/g, '<span>Tambah</span>');
    content = content.replace(/<span className="text-xs font-semibold uppercase tracking-wider">Cetak Data<\/span>/g, '<span>Cetak Data</span>');
    // For DataDampinganPage where it might still have h-11
    content = content.replace(/className="h-11 px-6 bg-\[#0080C5\][^"]*"/g, 'className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"');
    content = content.replace(/className="h-11 px-6 bg-\[#22C55E\][^"]*"/g, 'className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold"');

    // 5. Modal Simpan Buttons (Simpan Perubahan, etc)
    // They are usually h-10 or h-11. Let's make them h-9.
    content = content.replace(/className="px-6 h-10 bg-\[#0080C5\] text-white rounded-\[10px\][^"]*"/g, 'className="h-9 px-5 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"');
    content = content.replace(/className="px-8 h-10 bg-\[#0080C5\] text-white rounded-\[10px\][^"]*"/g, 'className="h-9 px-5 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"');
    content = content.replace(/className="px-6 h-11 bg-\[#0080C5\] text-white rounded-xl[^"]*"/g, 'className="h-9 px-5 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"');
    
    // Modal Batal buttons
    content = content.replace(/className="px-6 h-10 rounded-\[10px\] border border-gray-200[^"]*"/g, 'className="h-9 px-4 rounded-lg border border-gray-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all text-[13px] font-semibold"');
    content = content.replace(/className="px-8 h-10 rounded-\[10px\] border border-gray-200[^"]*"/g, 'className="h-9 px-4 rounded-lg border border-gray-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all text-[13px] font-semibold"');
    content = content.replace(/className="px-6 h-11 rounded-xl border border-gray-200[^"]*"/g, 'className="h-9 px-4 rounded-lg border border-gray-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all text-[13px] font-semibold"');

    // 6. Delete Confirm Button
    content = content.replace(/className="px-6 h-10 bg-\[#EF4444\] text-white rounded-\[10px\][^"]*"/g, 'className="h-9 px-5 bg-[#EF4444] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-sm text-[13px] font-semibold"');

    // Icons inside modal buttons
    content = content.replace(/<(Upload|Save|Trash2|Download) size=\{14\}/g, '<$1 size={16}');
    // Because sometimes I set them to 14, let's just make sure they look balanced with text-[13px]. size={16} is good.

    if(content !== originalContent) fs.writeFileSync(filePath, content);
}

fs.readdirSync(pagesDir).forEach(file => processFile(path.join(pagesDir, file)));
fs.readdirSync(modalsDir).forEach(file => processFile(path.join(modalsDir, file)));

console.log('All buttons and UI elements beautified.');
