import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCultureContentItem, useUpdateCultureContent } from '../hooks/useCultureContent';
import {
  CULTURE_CONTENT_TYPES,
  CULTURE_CONTENT_TYPE_LABELS,
  CULTURE_MEDIA_TYPES,
  CULTURE_MEDIA_TYPE_LABELS,
  type CultureContentType,
  type CultureMediaType,
} from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditCultureContentModalProps {
  contentId: string | null;
  onClose: () => void;
}

export function EditCultureContentModal({ contentId, onClose }: EditCultureContentModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!contentId;
  const { data: detail, isLoading: isLoadingDetail } = useCultureContentItem(contentId);
  const { mutate, isPending, error } = useUpdateCultureContent();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CultureContentType>('histoire');
  const [mediaType, setMediaType] = useState<CultureMediaType>('texte');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [author, setAuthor] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setTitle(detail.title);
    setType(detail.type);
    setMediaType(detail.media_type);
    setSummary(detail.summary ?? '');
    setContent(detail.content ?? '');
    setMediaUrl(detail.media_url ?? '');
    setRegion(detail.region ?? BURKINA_REGIONS[0]);
    setAuthor(detail.author ?? '');
    setPhotos(detail.cover_photo ? [detail.cover_photo] : []);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!contentId) return;
    mutate(
      {
        id: contentId,
        payload: {
          title,
          type,
          media_type: mediaType,
          summary: summary || undefined,
          content: content || undefined,
          media_url: mediaUrl || undefined,
          cover_photo: photos[0],
          region: region || undefined,
          author: author || undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Contenu culturel mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le contenu culturel">
      {isLoadingDetail && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoadingDetail && detail && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Titre" name="title" required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="type" className={styles.label}>
                Type
              </label>
              <select
                id="type"
                className={styles.select}
                value={type}
                onChange={(e) => setType(e.target.value as CultureContentType)}
              >
                {CULTURE_CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {CULTURE_CONTENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="media_type" className={styles.label}>
                Type de média
              </label>
              <select
                id="media_type"
                className={styles.select}
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as CultureMediaType)}
              >
                {CULTURE_MEDIA_TYPES.map((m) => (
                  <option key={m} value={m}>
                    {CULTURE_MEDIA_TYPE_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="summary" className={styles.label}>
              Résumé
            </label>
            <textarea
              id="summary"
              className={styles.textarea}
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>
              Contenu complet
            </label>
            <textarea
              id="content"
              className={styles.textarea}
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="region" className={styles.label}>
                Région
              </label>
              <select id="region" className={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
                {BURKINA_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Auteur" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <Input
            label="URL média (audio/vidéo)"
            name="media_url"
            placeholder="https://..."
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />

          <PhotoUploadField
            label="Photo de couverture"
            photos={photos}
            onChange={(next) => setPhotos(next.slice(-1))}
            onError={(msg) => push({ variant: 'error', message: msg })}
          />

          {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? <Spinner size={18} /> : 'Enregistrer les modifications'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
