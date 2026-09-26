const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:', 'Users', 'sansk', 'OneDrive', 'Desktop', 'ARENA', 'frontend', 'src');

// 1. Update services
const services = [
    'technicalService.ts',
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
    
    // Add TechnicalAnswerResponse export to technicalService.ts
    if (svc === 'technicalService.ts' && !content.includes('TechnicalAnswerResponse')) {
        content = content.replace('export interface TechnicalSession', `export interface TechnicalAnswerResponse {
  isCorrect: boolean;
  correctOption?: number;
  explanation: string;
}

export interface TechnicalSession`);
    }

    // Replace complete function signature
    content = content.replace(/score: number\s*\n\s*\): Promise<TechnicalResult> => {\n\s*return await ApiService\.post<TechnicalResult>\(`(.+?)\/complete`, {\n\s*score\n\s*}\);/, `): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(\`$1/complete\`, {});`);

    // Fix if there was a one-liner
    content = content.replace(/score: number\s*\): Promise<TechnicalResult> => {\n\s*return await ApiService\.post<TechnicalResult>\(`(.+?)\/complete`, { score }\);/, `): Promise<TechnicalResult> => {
  return await ApiService.post<TechnicalResult>(\`$1/complete\`, {});`);

    // Add submitAnswer
    if (!content.includes('submitAnswer')) {
        let basePath = '';
        if (svc === 'technicalService.ts') basePath = '/technical/sessions';
        else if (svc === 'cService.ts') basePath = '/technical/c/sessions';
        else if (svc === 'cppService.ts') basePath = '/technical/cpp/sessions';
        else if (svc === 'csCoreService.ts') basePath = '/technical/cs-core/sessions';
        else if (svc === 'javaService.ts') basePath = '/technical/java/sessions';
        else if (svc === 'pythonService.ts') basePath = '/technical/python/sessions';

        let funcName = '';
        if (svc === 'technicalService.ts') funcName = 'submitTechnicalAnswer';
        else if (svc === 'cService.ts') funcName = 'submitCAnswer';
        else if (svc === 'cppService.ts') funcName = 'submitCppAnswer';
        else if (svc === 'csCoreService.ts') funcName = 'submitCSCoreAnswer';
        else if (svc === 'javaService.ts') funcName = 'submitJavaAnswer';
        else if (svc === 'pythonService.ts') funcName = 'submitPythonAnswer';

        content += `\nexport const ${funcName} = async (
  sessionId: string,
  questionId: string,
  selectedOption: number
): Promise<TechnicalAnswerResponse> => {
  return await ApiService.post<TechnicalAnswerResponse>(\`${basePath}/\${sessionId}/answer\`, {
    questionId,
    selectedOption
  });
};\n`;
    }

    // Add TechnicalAnswerResponse to imports in other services
    if (svc !== 'technicalService.ts' && !content.includes('TechnicalAnswerResponse')) {
        content = content.replace(/TechnicalResult/, 'TechnicalResult, TechnicalAnswerResponse');
    }

    fs.writeFileSync(p, content);
}

// 2. Update Pages
const pages = [
    { p: 'pages/technical/TechnicalSessionPage.tsx', service: 'technicalService', func: 'submitTechnicalAnswer', complete: 'completeTechnicalSession' },
    { p: 'pages/technical/c/CSessionPage.tsx', service: 'cService', func: 'submitCAnswer', complete: 'completeCSession' },
    { p: 'pages/technical/cpp/CppSessionPage.tsx', service: 'cppService', func: 'submitCppAnswer', complete: 'completeCppSession' },
    { p: 'pages/technical/cs-core/CSSessionPage.tsx', service: 'csCoreService', func: 'submitCSCoreAnswer', complete: 'completeCSCoreSession' },
    { p: 'pages/technical/java/JavaSessionPage.tsx', service: 'javaService', func: 'submitJavaAnswer', complete: 'completeJavaSession' },
    { p: 'pages/technical/python/PythonSessionPage.tsx', service: 'pythonService', func: 'submitPythonAnswer', complete: 'completePythonSession' }
];

for (const page of pages) {
    const p = path.join(srcDir, page.p);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf-8');

    // Update imports
    if (!content.includes(page.func)) {
        content = content.replace(page.complete, `${page.complete}, ${page.func}`);
    }

    // Find handleComplete / handleNext to remove `score` calculation and change API call
    if (page.p.includes('TechnicalSessionPage.tsx')) {
        content = content.replace(/const q = session\.questions\[session\.currentQuestionIndex\];[\s\S]*?const score = isCorrect \? 100 : 0;\s*try {/g, `try {`);
        content = content.replace(/await completeTechnicalSession\(session\.sessionId, score\);/g, `const result = await completeTechnicalSession(session.sessionId, 0);\n      const isCorrect = (result.score / result.totalQuestions) > 0.5;\n      const score = Math.round((result.score / result.totalQuestions) * 100);`);
    } else {
        content = content.replace(/const q = session\.questions\[currentIndex\];[\s\S]*?if \(isCorrect\) setScore\(s => s \+ 1\);/g, ``);
        content = content.replace(/const finalScore = score \+ \(isCorrect \? 1 : 0\);/g, ``);
        content = content.replace(new RegExp(`await ${page.complete}\\(session\\.sessionId, finalScore\\);`), `const result = await ${page.complete}(session.sessionId, 0);`);
        // Fix navigation to use result.score
        content = content.replace(/score: finalScore/g, `score: result.score`);
        // Fix isCorrect logic for progress tracking
        content = content.replace(/isCorrect: \(finalScore \/ session\.questionCount\) > 0\.5,/g, `isCorrect: (result.score / session.questionCount) > 0.5,`);
        content = content.replace(/score: Math\.round\(\(finalScore \/ session\.questionCount\) \* 100\)/g, `score: Math.round((result.score / session.questionCount) * 100)`);
    }

    // Add state for dynamically fetched answer info
    if (!content.includes('const [answerData, setAnswerData]')) {
        content = content.replace(/const \[showExplanation, setShowExplanation\] = useState\(false\);/, `const [showExplanation, setShowExplanation] = useState(false);\n  const [answerData, setAnswerData] = useState<any>(null);`);
    }

    // Modify onClick for Submit Answer
    if (content.includes('onClick={() => setShowExplanation(true)}')) {
        const submitHandler = `onClick={async () => {
            try {
              setLoading(true);
              const q = session.questions[${page.p.includes('TechnicalSession') ? 'session.currentQuestionIndex' : 'currentIndex'}];
              const data = await ${page.func}(session.sessionId, q.questionId, selectedOption as number);
              setAnswerData(data);
              setShowExplanation(true);
            } catch(e: any) {
              setError(e.message);
            } finally {
              setLoading(false);
            }
          }}`;
        content = content.replace(/onClick=\{\(\) => setShowExplanation\(true\)\}/g, submitHandler);
    }

    // Replace currentQ.correctOption with answerData?.correctOption
    content = content.replace(/currentQ\.correctOption/g, `answerData?.correctOption`);
    // Replace currentQ.explanation with answerData?.explanation
    content = content.replace(/currentQ\.explanation/g, `answerData?.explanation`);

    // Reset answerData on handleNext
    if (content.includes('setShowExplanation(false);')) {
        content = content.replace(/setShowExplanation\(false\);/, `setShowExplanation(false);\n      setAnswerData(null);`);
    }

    fs.writeFileSync(p, content);
}

console.log('Frontend refactoring complete.');
