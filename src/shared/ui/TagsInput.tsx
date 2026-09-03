import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

import styles from './TagsInput.module.css';

interface TagsInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ label, values, onChange, placeholder }: TagsInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...values, trimmed]);
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.box}>
        {values.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Retirer ${tag}`}>
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder ?? 'Ajouter et appuyer sur Entrée'}
        />
      </div>
    </div>
  );
}
