import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from './Badge';

export interface TagInputProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'neutral';
}

export const TagInput: React.FC<TagInputProps> = ({
  tags = [],
  onChange,
  placeholder = 'Add new tag...',
  suggestions = [],
  variant = 'primary',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;

    // Duplicate check (case-insensitive)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
    <div className="tag-input-container">
      {/* Tag Chips List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {tags.map((tag, index) => (
          <Badge key={index} variant={variant} style={{ paddingRight: '0.4rem', fontSize: '0.82rem' }}>
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                marginLeft: '0.35rem',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              title={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </Badge>
        ))}

        {tags.length === 0 && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            No items added yet.
          </span>
        )}
      </div>

      {/* Input Field and Add Button */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => handleAddTag(inputValue)}
          style={{
            padding: '0.55rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-light)',
            border: '1px solid var(--border-color-glow)',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem',
          }}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {/* Suggested Quick Tags */}
      {suggestions.length > 0 && (
        <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Suggestions:</span>
          {suggestions
            .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
            .slice(0, 6)
            .map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddTag(sug)}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.73rem',
                  cursor: 'pointer',
                }}
              >
                + {sug}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
