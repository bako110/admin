import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useGuide, useUpdateGuide } from '../hooks/useGuides';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditGuideModalProps {
  guideId: string | null;
  onClose: () => void;
}

export function EditGuideModal({ guideId, onClose }: EditGuideModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!guideId;
  const { data: detail, isLoading: isLoadingDetail } = useGuide(guideId);
  const { mutate, isPending, error } = useUpdateGuide();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [regionsCovered, setRegionsCovered] = useState<string>(BURKINA_REGIONS[0]);
  const [dailyRate, setDailyRate] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setDisplayName(detail.display_name);
    setBio(detail.bio ?? '');
    setLanguages(detail.languages.join(', '));
    setSpecialties(detail.specialties.join(', '));
    setRegionsCovered(detail.regions_covered[0] ?? BURKINA_REGIONS[0]);
    setDailyRate(detail.daily_rate !== undefined ? String(detail.daily_rate) : '');
    setHourlyRate(detail.hourly_rate !== undefined ? String(detail.hourly_rate) : '');
    setPhotos(detail.photo_url ? [detail.photo_url] : []);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!guideId) return;
    mutate(
      {
        id: guideId,
        payload: {
          display_name: displayName,
          bio: bio || undefined,
          photo_url: photos[0],
          languages: languages
            .split(',')
            .map((l) => l.trim())
            .filter(Boolean),
          specialties: specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          regions_covered: [regionsCovered],
          hourly_rate: hourlyRate ? Number(hourlyRate) : undefined,
          daily_rate: dailyRate ? Number(dailyRate) : undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Guide mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le guide">
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
            <label htmlFor="bio" className={styles.label}>
              Bio
            </label>
            <textarea
              id="bio"
              className={styles.textarea}
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Langues (séparées par virgule)"
              name="languages"
              placeholder="Français, Anglais, Mooré"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
            <Input
              label="Spécialités (séparées par virgule)"
              name="specialties"
              placeholder="Randonnée, Culture"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="region" className={styles.label}>
              Région couverte
            </label>
            <select
              id="region"
              className={styles.select}
              value={regionsCovered}
              onChange={(e) => setRegionsCovered(e.target.value)}
            >
              {BURKINA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <Input
              label="Tarif journalier (XOF)"
              name="daily_rate"
              type="number"
              step="any"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
            />
            <Input
              label="Tarif horaire (XOF)"
              name="hourly_rate"
              type="number"
              step="any"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
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
