const fs = require('fs');
const path = 'e:/abdelrahman/my-champ-site-main/my-champ-site-main/my-champ-site-main/app/admin/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// Fix className accesses
code = code.replace(/\$\{props\.className \|\| ""\}/g, '');

// Fix Cover Image AdminLabel
code = code.replace(/<AdminLabel>Cover image \(gif\)<\/AdminLabel>/g, '<h4 className="text-sm font-medium text-gray-700 mb-2">Cover image (gif)</h4>');

// Let's also make sure no other AdminLabel exists
const matches = code.match(/<AdminLabel.*?>(.*?)<\/AdminLabel>/g);
if (matches) {
    console.log("Found remaining AdminLabels:", matches);
    // Replace any remaining ones with an h4
    code = code.replace(/<AdminLabel(?:.*?)>(.*?)<\/AdminLabel>/g, '<h4 className="text-sm font-medium text-gray-700 mb-2">$1</h4>');
} else {
    console.log("No more AdminLabels found!");
}

// Make sure the dropdown arrows on floating selects match logic
code = code.replace(/className={\`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-2 focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base appearance-none transition-colors \`}/g, 'className={`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-2 focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base appearance-none transition-colors ${className}`}');
code = code.replace(/className={\`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors \`}/g, 'className={`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors ${className}`}');
code = code.replace(/className={\`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-2 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors resize-none \`}/g, 'className={`peer mt-1 w-full border-b-2 border-gray-300 px-0 py-2 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors resize-none ${className}`}');


fs.writeFileSync(path, code);
console.log("Fixed TS errors");
