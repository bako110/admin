import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCreateMoneyService } from '../hooks/useMoneyServices';
import { MONEY_SERVICE_TYPES, MONEY_SERVICE_TYPE_LABELS, type MoneyServiceType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateMoneyServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMoneyServiceModal({ open, onClose }: CreateMoneyServiceModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateMoneyService();

  const [name, setName] = useState('');
  const [type, setType] = useState<MoneyServiceType>('banque');
  const [operator, setOperator] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  function resetAndClose() {
    setName('');
    setType('banque');
    setOperator('');
    setRegion(BURKINA_REGIONS[0]);
    setCity('');
    setAddress('');
    setLatitude('');
    setLongitude('');
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
        operator: operator || undefined,
        region,
        city: city || undefined,
        address: address || undefined,
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        contact_phone: contactPhone || undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Point banque/argent créé avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouveau point banque / argent">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nom" name="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="type" className={styles.label}>
              Type
            </label>
            <select
              id="type"
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as MoneyServiceType)}
            >
              {MONEY_SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {MONEY_SERVICE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Opérateur"
            name="operator"
            placeholder="Ex : Orange Money, Coris Bank"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
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

        <div className={styles.row}>
          <Input label="Adresse" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input
            label="Téléphone de contact"
            name="contact_phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
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

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : 'Créer le point'}
        </Button>
      </form>
    </Modal>
  );
}
