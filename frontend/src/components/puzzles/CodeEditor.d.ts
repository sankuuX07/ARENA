import React from 'react';
interface CodeEditorProps {
    language: string;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    disabled?: boolean;
}
export declare const CodeEditor: React.FC<CodeEditorProps>;
export {};
//# sourceMappingURL=CodeEditor.d.ts.map