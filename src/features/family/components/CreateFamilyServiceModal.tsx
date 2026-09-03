import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCreateFamilyService } from '../hooks/useFamilyServices';
import { FAMILY_SERVICE_TYPES, FAMILY_SERVICE_TYPE_LABELS, type FamilyServiceType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateFamilyServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFamilyServiceModal({ open, onClose }: CreateFamilyServiceModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateFamilyService();

  const [name, setName] = useState('');
  const [type, setType] = useState<FamilyServiceType>('activite_familiale');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isFamilyFriendly, setIsFamilyFriendly] = useState(true);
  const [contactPhone, setContactPhone] = useState('');

  function resetAndClose() {
    setName('');
    setType('activite_familiale');
    setDescription('');
    setRegion(BURKINA_REGIONS[0]);
    setCity('');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setIsFamilyFriendly(true);
    setContactPhone('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!latitude || !longitude) {
      push({ variant: 'error', message: 'Indique une localisation (carte ou lien Google Maps).' });
      return;
    }
    mutate(
      {
        name,
        type,
        description: description || undefined,
        region,
        city: city || undefined,
        address: address || undefined,
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        is_family_friendly: isFamilyFriendly,
        contact_phone: contactPhone || undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Service familial créé avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouveau service familial">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nom" name="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
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
              onChange={(e) => setType(e.target.value as FamilyServiceType)}
            >
              {FAMILY_SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FAMILY_SERVICE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        <div className={styles.row}>
          <Input label="Ville" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Adresse" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Localisation</label>
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
            label="Téléphone de contact"
            name="contact_phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={isFamilyFriendly} onChange={(e) => setIsFamilyFriendly(e.target.checked)} />
            Adapté aux familles
          </label>
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : 'Créer le service'}
        </Button>
      </form>
    </Modal>
  );
}
