const fs = require('fs');
const path = 'e:/abdelrahman/my-champ-site-main/my-champ-site-main/my-champ-site-main/app/admin/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const newComponents = `const WhiteCard = ({ children, title, subtitle, className = "" }: { children: React.ReactNode; title?: string; subtitle?: string; className?: string }) => (
  <div className={\`bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5 p-6 md:p-8 relative overflow-hidden group \${className}\`}>
    {title && (
      <div className="mb-6 relative z-10 text-center md:text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

const FloatingInput = ({ id, label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) => (
  <div className={\`relative mt-6 z-0 \${className}\`}>
    <input
      id={id}
      placeholder={label}
      {...props}
      className={\`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-1.5 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors \${props.className || ""}\`}
    />
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
    >
      {label}
    </label>
  </div>
);

const FloatingTextArea = ({ id, label, className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string }) => (
  <div className={\`relative mt-6 z-0 \${className}\`}>
    <textarea
      id={id}
      placeholder={label}
      {...props}
      className={\`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-2 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors resize-none \${props.className || ""}\`}
    />
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
    >
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ id, label, children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string }) => (
  <div className={\`relative mt-6 z-0 \${className}\`}>
    <select
      id={id}
      {...props}
      className={\`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-2 focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors \${props.className || ""}\`}
    >
      {children}
    </select>
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out"
    >
      {label}
    </label>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);`;

// Replace everything from const WhiteCard to the end of FloatingSelect
code = code.replace(/const WhiteCard = \(\{.*?\}\) => \([\s\S]*?const FloatingSelect = \(\{.*?\}\) => \([\s\S]*?<\/div>\n\);/m, newComponents);

// Since React doesn't natively remove placeholder-shown for 'select', it doesn't matter since select always has a value immediately.
fs.writeFileSync(path, code);
console.log('Restored the original reliable components style.');
