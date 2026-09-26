const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:', 'Users', 'sansk', 'OneDrive', 'Desktop', 'ARENA', 'frontend', 'src');

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

    // Make sure TechnicalAnswerResponse is in the import
    if (!content.includes(', TechnicalAnswerResponse }')) {
        content = content.replace(/TechnicalResult } from '\.\/technicalService';/, 'TechnicalResult, TechnicalAnswerResponse } from \'./technicalService\';');
    }

    fs.writeFileSync(p, content);
}
console.log('Done');
