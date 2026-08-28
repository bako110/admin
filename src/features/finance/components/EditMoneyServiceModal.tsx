import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useMoneyService, useUpdateMoneyService } from '../hooks/useMoneyServices';
import { MONEY_SERVICE_TYPES, MONEY_SERVICE_TYPE_LABELS, type MoneyServiceType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditMoneyServiceModalProps {
  moneyServiceId: string | null;
  onClose: () => void;
}

export function EditMoneyServiceModal({ moneyServiceId, onClose }: EditMoneyServiceModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!moneyServiceId;
  const { data: detail, isLoading: isLoadingDetail } = useMoneyService(moneyServiceId);
  const { mutate, isPending, error } = useUpdateMoneyService();

  const [name, setName] = useState('');
  const [type, setType] = useState<MoneyServiceType>('banque');
  const [operator, setOperator] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    if (!detail) return;
    setName(detail.name);
    setType(detail.type);
    setOperator(detail.operator ?? '');
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setAddress(detail.address ?? '');
    setLatitude(String(detail.location.latitude));
    setLongitude(String(detail.location.longitude));
    setContactPhone(detail.contact_phone ?? '');
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!moneyServiceId) return;
    if (!latitude || !longitude) {
      push({ variant: 'error', message: 'Indique une localisation (carte ou lien Google Maps).' });
      return;
    }
    mutate(
      {
        id: moneyServiceId,
        payload: {
          name,
          type,
          operator: operator || undefined,
          region,
          city: city || undefined,
          address: address || undefined,
          location: { latitude: Number(latitude), longitude: Number(longitude) },
          contact_phone: contactPhone || undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Point banque/argent mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le point banque / argent">
      {isLoadingDetail && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoadingDetail && detail && (
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
            {isPending ? <Spinner size={18} /> : 'Enregistrer les modifications'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
