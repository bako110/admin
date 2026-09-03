import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCreateDiasporaContent } from '../hooks/useDiasporaContents';
import { DIASPORA_CONTENT_TYPES, DIASPORA_CONTENT_TYPE_LABELS, type DiasporaContentType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateDiasporaContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDiasporaContentModal({ open, onClose }: CreateDiasporaContentModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateDiasporaContent();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<DiasporaContentType>('circuit_culturel');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  function resetAndClose() {
    setTitle('');
    setType('circuit_culturel');
    setDescription('');
    setRegion('');
    setLatitude('');
    setLongitude('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      {
        title,
        type,
        description,
        region: region || undefined,
        location: latitude && longitude ? { latitude: Number(latitude), longitude: Number(longitude) } : undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Contenu diaspora créé avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouveau contenu diaspora">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Titre" name="title" required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            required
            minLength={10}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="type" className={styles.label}>
              Type
            </label>
            <select
              id="type"
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as DiasporaContentType)}
            >
              {DIASPORA_CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DIASPORA_CONTENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="region" className={styles.label}>
              Région (optionnelle)
            </label>
            <select id="region" className={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">—</option>
              {BURKINA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Localisation (optionnelle)</label>
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : 'Créer le contenu'}
        </Button>
      </form>
    </Modal>
  );
}
