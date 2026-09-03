import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useEduOuting, useUpdateEduOuting } from '../hooks/useEduOutings';
import { EDU_OUTING_TYPES, EDU_OUTING_TYPE_LABELS, type EduOutingType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditEduOutingModalProps {
  outingId: string | null;
  onClose: () => void;
}

export function EditEduOutingModal({ outingId, onClose }: EditEduOutingModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!outingId;
  const { data: detail, isLoading: isLoadingDetail } = useEduOuting(outingId);
  const { mutate, isPending, error } = useUpdateEduOuting();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EduOutingType>('visite_historique');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [targetLevel, setTargetLevel] = useState('');
  const [pricePerParticipant, setPricePerParticipant] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [maxParticipants, setMaxParticipants] = useState('');

  useEffect(() => {
    if (!detail) return;
    setTitle(detail.title);
    setType(detail.type);
    setDescription(detail.description);
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setLatitude(detail.location ? String(detail.location.latitude) : '');
    setLongitude(detail.location ? String(detail.location.longitude) : '');
    setTargetLevel(detail.target_level ?? '');
    setPricePerParticipant(detail.price_per_participant != null ? String(detail.price_per_participant) : '');
    setCurrency(detail.currency);
    setMaxParticipants(detail.max_participants != null ? String(detail.max_participants) : '');
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!outingId) return;
    mutate(
      {
        id: outingId,
        payload: {
          title,
          type,
          description,
          region,
          city: city || undefined,
          location: latitude && longitude ? { latitude: Number(latitude), longitude: Number(longitude) } : undefined,
          target_level: targetLevel || undefined,
          price_per_participant: pricePerParticipant ? Number(pricePerParticipant) : undefined,
          currency,
          max_participants: maxParticipants ? Number(maxParticipants) : undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Sortie éducative mise à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier la sortie éducative">
      {isLoadingDetail && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoadingDetail && detail && (
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
                onChange={(e) => setType(e.target.value as EduOutingType)}
              >
                {EDU_OUTING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {EDU_OUTING_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Niveau ciblé"
              name="target_level"
              placeholder="Ex : Collège, Lycée, Université"
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
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

          <div className={styles.row}>
            <Input
              label="Prix par participant"
              type="number"
              min={0}
              value={pricePerParticipant}
              onChange={(e) => setPricePerParticipant(e.target.value)}
            />
            <div className={styles.field}>
              <label className={styles.label}>Devise</label>
              <select className={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="XOF">XOF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <Input
            label="Nombre maximum de participants"
            type="number"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
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
