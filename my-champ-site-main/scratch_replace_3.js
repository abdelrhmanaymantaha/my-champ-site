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
      placeholder=" "
      {...props}
      className={\`peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 \${props.className || ""}\`}
    />
    <label
      htmlFor={id}
      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gray-900"
    >
      {label}
    </label>
  </div>
);

const FloatingTextArea = ({ id, label, className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string }) => (
  <div className={\`relative mt-6 z-0 \${className}\`}>
    <textarea
      id={id}
      placeholder=" "
      {...props}
      className={\`peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 resize-none \${props.className || ""}\`}
    />
    <label
      htmlFor={id}
      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gray-900"
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
      className={\`peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 \${props.className || ""}\`}
    >
      {children}
    </select>
    <label
      htmlFor={id}
      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gray-900"
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

// Also remove placeholder text on select tags that were manually embedded previously if any
fs.writeFileSync(path, code);
console.log('Fixed floating label components.');
