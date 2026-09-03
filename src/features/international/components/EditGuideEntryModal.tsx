import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUpdateGuideEntry } from '../hooks/useGuideEntries';
import {
  FIRST_VISIT_GUIDE_CATEGORIES,
  FIRST_VISIT_GUIDE_CATEGORY_LABELS,
  type FirstVisitGuideCategory,
  type GuideEntry,
} from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditGuideEntryModalProps {
  entry: GuideEntry | null;
  onClose: () => void;
}

export function EditGuideEntryModal({ entry, onClose }: EditGuideEntryModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useUpdateGuideEntry();

  const [category, setCategory] = useState<FirstVisitGuideCategory>('culture_usages');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    if (!entry) return;
    setCategory(entry.category);
    setTitle(entry.title);
    setContent(entry.content);
    setLanguage(entry.language);
  }, [entry]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!entry) return;
    mutate(
      { id: entry.id, payload: { category, title, content, language } },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Entrée du guide mise à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={!!entry} onClose={onClose} title="Modifier l'entrée du guide">
      {entry && (
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
            <Input
              label="Langue"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="fr"
            />
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
            {isPending ? <Spinner size={18} /> : 'Enregistrer les modifications'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
