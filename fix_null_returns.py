"""
Fix all `return null;` blanks in technical session pages.
Run from ARENA root dir.
"""
import re

FILES = [
    r"frontend\src\pages\technical\cpp\CppSessionPage.tsx",
    r"frontend\src\pages\technical\java\JavaSessionPage.tsx",
    r"frontend\src\pages\technical\python\PythonSessionPage.tsx",
    r"frontend\src\pages\technical\cs-core\CSSessionPage.tsx",
    r"frontend\src\pages\technical\TechnicalSessionPage.tsx",
    r"frontend\src\pages\recommendations\RecommendationsPage.tsx",
    r"frontend\src\pages\analytics\StudentAnalyticsOverviewPage.tsx",
]

OLD = '  if (!session || session.questions.length === 0) return null;'
NEW = '''  if (!session || session.questions.length === 0) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--error)' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Could not load session questions.</div>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The AI may be busy or unavailable. Please try again.</div>
      <button onClick={() => window.history.back()} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Go Back</button>
    </div>
  );'''

OVERVIEW_OLD = '  if (!overview) return null;'
OVERVIEW_NEW = '''  if (!overview) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No data available yet.</div>
      <div>Complete some practice sessions to see your analytics here.</div>
    </div>
  );'''

for path in FILES:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        if OLD in content:
            content = content.replace(OLD, NEW)
            print(f"Fixed session null: {path}")
        
        if OVERVIEW_OLD in content:
            content = content.replace(OVERVIEW_OLD, OVERVIEW_NEW)
            print(f"Fixed overview null: {path}")
        
        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
        else:
            # Try variations
            if 'return null' in content:
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if 'return null' in line and ('session' in line or 'overview' in line):
                        print(f"Found different null pattern at {path}:{i+1}: {line.strip()}")
            else:
                print(f"No null found: {path}")
                
    except FileNotFoundError:
        print(f"NOT FOUND: {path}")
    except Exception as e:
        print(f"ERROR {path}: {e}")

print("Done.")
