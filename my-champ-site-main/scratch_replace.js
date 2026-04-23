const fs = require('fs');
const path = 'e:/abdelrahman/my-champ-site-main/my-champ-site-main/my-champ-site-main/app/admin/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace standard div-wrapped AdminInputs
// E.g.: <div><AdminLabel htmlFor="hero-title">Main Hero Title</AdminLabel><AdminInput id="hero-title" ... /></div>
code = code.replace(/<div>\s*<AdminLabel(?: htmlFor="([^"]+)")?>([^<]+)<\/AdminLabel>\s*<AdminInput(?: id="([^"]+)")?(.*?)\/>\s*<\/div>/g, (match, htmlFor, label, id, rest) => {
  const actualId = htmlFor || id || label.replace(/\s+/g, '-').toLowerCase();
  return `<FloatingInput id="${actualId}" label="${label}"${rest}/>`;
});

// Replace standard div-wrapped AdminTextAreas
// E.g.: <div><AdminLabel>Main Description</AdminLabel><AdminTextArea rows={4} ... /></div>
code = code.replace(/<div>\s*<AdminLabel(?: htmlFor="([^"]+)")?>([^<]+)<\/AdminLabel>\s*<AdminTextArea(?: id="([^"]+)")?(.*?)\/>\s*<\/div>/g, (match, htmlFor, label, id, rest) => {
  const actualId = htmlFor || id || label.replace(/\s+/g, '-').toLowerCase();
  return `<FloatingTextArea id="${actualId}" label="${label}"${rest}/>`;
});

// Other usages.
code = code.replace(/<AdminLabel>Value Propositions<\/AdminLabel>\s*\{content\.hero\.bulletPoints\.map\(\(bp, i\) => \(\s*<div key=\{i\} className="flex gap-3">\s*<AdminTextArea/g, 
  `<h4 className="text-sm text-gray-800 opacity-75 font-medium mb-2 mt-6">Value Propositions</h4>\n            {content.hero.bulletPoints.map((bp, i) => (\n              <div key={i} className="flex gap-3">\n                <FloatingTextArea label={\`Bullet Point \${i + 1}\`} id={\`bp-\${i}\`}`);

// Navbar Identity row inputs:
// <div><AdminLabel>Studio Name</AdminLabel><AdminInput value={content.navbar.name} onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, name: e.target.value } })} /></div>

// Section titles inputs
// <div className="flex items-center gap-3"><span className="w-16 text-[10px] uppercase tracking-widest text-white/25 shrink-0">About</span><AdminInput ... /></div>
code = code.replace(/<div className="flex items-center gap-3"><span className="w-16 text-\[10px\] uppercase tracking-widest text-white\/25 shrink-0">([^<]+)<\/span><AdminInput(.*?)\/><\/div>/g, (match, label, rest) => {
  return `<FloatingInput id="section-${label.toLowerCase()}" label="${label}"${rest}/>`;
});

// Selects
code = code.replace(/<div>\s*<AdminLabel htmlFor="proj-section">Category<\/AdminLabel>\s*<select id="proj-section"(.*?)\s*className=\{inputClasses\}>\s*([\s\S]*?)<\/select>\s*<\/div>/g, (match, rest, options) => {
  return `<FloatingSelect id="proj-section" label="Category"${rest}>\n${options}\n</FloatingSelect>`;
});

// Clean up standard un-wrapped AdminLabel + AdminInput/AdminTextArea inside GlassCards. Example: play section:
// <AdminLabel>Explanatory Text</AdminLabel>\n<AdminTextArea rows={3} ...
code = code.replace(/<AdminLabel>([^<]+)<\/AdminLabel>\s*<AdminTextArea(.*?)\/>/g, (match, label, rest) => {
  const actualId = label.replace(/\s+/g, '-').toLowerCase();
  return `<FloatingTextArea id="${actualId}" label="${label}"${rest}/>`;
});

// The avatar upload label
code = code.replace(/<AdminLabel>Profile Avatar<\/AdminLabel>/g, `<h4 className="text-sm font-medium text-gray-700 mb-2">Profile Avatar</h4>`);
code = code.replace(/<AdminLabel>Project Cover \(GIF or Image\)<\/AdminLabel>/g, `<h4 className="text-sm font-medium text-gray-700 mb-2">Project Cover (GIF or Image)</h4>`);
code = code.replace(/<AdminLabel>Gallery Images<\/AdminLabel>/g, `<h4 className="text-sm font-medium text-gray-700 mb-2">Gallery Images</h4>`);

// Header color replacement
code = code.replace(/<header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-black\/60 border-b border-white\/\[0\.06\]">/g, 
  `<header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b1215]/80 border-b border-white/[0.06]">`);

// Content Container adjustments to let the white cards pop.
code = code.replace(/<main className="w-full flex flex-col items-center relative min-h-screen text-white\/90">/g, 
  `<main className="w-full flex flex-col items-center relative min-h-screen text-gray-900 bg-[#0b1215]">`);

// Save All button
code = code.replace(/<button\s*type="button"\s*onClick=\{saveAllContent\}\s*disabled=\{saving\}\s*className="px-5 py-2\.5 bg-white text-black text-\[10px\] font-bold uppercase tracking-\[0\.12em\] rounded-full hover:bg-white\/90 active:scale-\[0\.97\] transition-all disabled:opacity-30"\s*>/g, 
  `<button type="button" onClick={saveAllContent} disabled={saving} className="px-6 py-2.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50">`);

// Replace remaining GlassCards that weren't captured by the initial Python replace
code = code.replace(/<GlassCard /g, `<WhiteCard `);
code = code.replace(/<\/GlassCard>/g, `</WhiteCard>`);

// Submit button in new project
code = code.replace(/className="w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-\[11px\] hover:bg-white\/90 active:scale-\[0\.99\] transition-all disabled:opacity-20 flex items-center justify-center gap-2"/g, 
  `className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-800 hover:bg-gray-800 font-medium transition-all active:scale-[0.98] disabled:opacity-50 mt-6"`);

// Modal styling updates
code = code.replace(/className="w-full max-w-3xl bg-\[\#0f0f0f\] border border-white\/\[0\.08\] rounded-3xl shadow-2xl relative z-\[110\] overflow-hidden flex flex-col max-h-\[85vh\]"/g,
  `className="w-full max-w-3xl bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5 relative z-[110] overflow-hidden flex flex-col max-h-[85vh]"`);
code = code.replace(/className="text-xl font-semibold text-white">Edit Project<\/h2>/g, 
  `className="text-2xl font-semibold text-gray-900">Edit Project</h2>`);
code = code.replace(/className="text-\[10px\] text-white\/25 uppercase tracking-widest mt-0\.5">Refining \{editProjectDraft\.title\}<\/p>/g,
  `className="text-sm text-gray-500 mt-1">Refining {editProjectDraft.title}</p>`);
code = code.replace(/className="w-10 h-10 rounded-full border border-white\/\[0\.08\] flex items-center justify-center text-white\/30 hover:text-white transition-all"/g,
  `className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"`);
code = code.replace(/className="px-8 py-6 border-b border-white\/\[0\.06\] flex items-center justify-between shrink-0"/g,
  `className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0"`);
code = code.replace(/className="p-8 border-t border-white\/\[0\.06\] flex gap-3 shrink-0"/g,
  `className="p-8 border-t border-gray-100 flex gap-3 shrink-0"`);
code = code.replace(/className="flex-1 py-3\.5 bg-white text-black font-bold uppercase tracking-widest text-\[10px\] rounded-2xl hover:bg-white\/90 active:scale-\[0\.98\] transition-all"/g,
  `className="flex-1 rounded-md bg-black px-3 py-4 text-white focus:bg-gray-800 hover:bg-gray-800 font-medium transition-all active:scale-[0.98]"`);
code = code.replace(/className="px-8 py-3\.5 border border-white\/\[0\.08\] text-white text-\[10px\] font-bold uppercase tracking-widest rounded-2xl hover:bg-white\/\[0\.04\] transition-all"/g,
  `className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-all"`);


fs.writeFileSync(path, code);
console.log('Modifications written successfully!');
