import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useArtisan, useUpdateArtisan } from '../hooks/useArtisans';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditArtisanModalProps {
  artisanId: string | null;
  onClose: () => void;
}

export function EditArtisanModal({ artisanId, onClose }: EditArtisanModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!artisanId;
  const { data: detail, isLoading: isLoadingDetail } = useArtisan(artisanId);
  const { mutate, isPending, error } = useUpdateArtisan();

  const [displayName, setDisplayName] = useState('');
  const [story, setStory] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setDisplayName(detail.display_name);
    setStory(detail.story ?? '');
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setPhotos(detail.photo_url ? [detail.photo_url] : []);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!artisanId) return;
    mutate(
      {
        id: artisanId,
        payload: {
          display_name: displayName,
          story: story || undefined,
          photo_url: photos[0],
          region,
          city: city || undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Artisan mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier l'artisan">
      {isLoadingDetail && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoadingDetail && detail && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nom affiché"
            name="display_name"
            required
            minLength={2}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div className={styles.field}>
            <label htmlFor="story" className={styles.label}>
              Histoire du fabricant
            </label>
            <textarea
              id="story"
              className={styles.textarea}
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
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
            <Input label="Ville" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <PhotoUploadField
            label="Photo de profil"
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
