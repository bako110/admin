import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateGuideEntry } from '../hooks/useGuideEntries';
import { FIRST_VISIT_GUIDE_CATEGORIES, FIRST_VISIT_GUIDE_CATEGORY_LABELS, type FirstVisitGuideCategory } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateGuideEntryModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGuideEntryModal({ open, onClose }: CreateGuideEntryModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateGuideEntry();

  const [category, setCategory] = useState<FirstVisitGuideCategory>('culture_usages');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('fr');

  function resetAndClose() {
    setCategory('culture_usages');
    setTitle('');
    setContent('');
    setLanguage('fr');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { category, title, content, language },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Entrée du guide créée avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouvelle entrée du guide">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Titre" name="title" required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>
              Catégorie
            </label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as FirstVisitGuideCategory)}
            >
              {FIRST_VISIT_GUIDE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {FIRST_VISIT_GUIDE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <Input label="Langue" name="language" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="fr" />
        </div>

        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>
            Contenu
          </label>
          <textarea
            id="content"
            className={styles.textarea}
            required
            minLength={5}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : "Créer l'entrée"}
        </Button>
      </form>
    </Modal>
  );
}
