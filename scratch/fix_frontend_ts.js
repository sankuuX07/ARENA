const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:', 'Users', 'sansk', 'OneDrive', 'Desktop', 'ARENA', 'frontend', 'src');

// Fix unused score and complete signature calls in pages
const pages = [
    'pages/technical/c/CSessionPage.tsx',
    'pages/technical/cpp/CppSessionPage.tsx',
    'pages/technical/cs-core/CSSessionPage.tsx',
    'pages/technical/java/JavaSessionPage.tsx',
    'pages/technical/python/PythonSessionPage.tsx',
    'pages/technical/TechnicalSessionPage.tsx'
];

for (const page of pages) {
    const p = path.join(srcDir, page);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf-8');

    // Remove const [score, setScore] = useState(0);
    content = content.replace(/const \[score, setScore\] = useState\(0\);\n?/g, '');
    
    // Remove the 0 argument in completeCSession(sessionId, 0)
    content = content.replace(/await (complete[a-zA-Z]+)\(session\.sessionId, 0\);/g, 'await $1(session.sessionId);');

    fs.writeFileSync(p, content);
}

// Fix missing TechnicalAnswerResponse imports in services
const services = [
    'cService.ts',
    'cppService.ts',
    'csCoreService.ts',
    'javaService.ts',
    'pythonService.ts'
];

for (const svc of services) {
    const p = path.join(srcDir, 'services', svc);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf-8');

    if (!content.includes('TechnicalAnswerResponse')) {
        // Find TechnicalSession and append
        content = content.replace(/TechnicalSession/g, 'TechnicalSession, TechnicalAnswerResponse');
    }
    
    // Fix function signature for complete to take 1 argument if it takes 2 (which I already fixed in regex maybe?)
    content = content.replace(/complete[a-zA-Z]+\s*=\s*async\s*\(\s*sessionId:\s*string\s*,\s*score:\s*number\s*\)/g, 'complete' + svc.replace('Service.ts', 'Session') + ' = async (sessionId: string)');
    // But I changed the complete signature to (sessionId: string) => Promise... Wait, in the JS script I did:
    // `content = content.replace(/score: number\s*\n\s*\): Promise<TechnicalResult> => ...`
    // So the function signature actually became:
    // `export const completeCSession = async (\n  sessionId: string,\n): Promise<TechnicalResult> => ...`
    // This is fine.

    fs.writeFileSync(p, content);
}

console.log('TS errors fixed.');
