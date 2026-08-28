import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCreateTransportProvider } from '../hooks/useTransportProviders';
import { TRANSPORT_TYPES, TRANSPORT_TYPE_LABELS, type TransportType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateTransportProviderModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTransportProviderModal({ open, onClose }: CreateTransportProviderModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateTransportProvider();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransportType>('taxi_vtc');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  function resetAndClose() {
    setName('');
    setType('taxi_vtc');
    setDescription('');
    setRegion(BURKINA_REGIONS[0]);
    setCity('');
    setLatitude('');
    setLongitude('');
    setVehicleInfo('');
    setPriceEstimate('');
    setContactPhone('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      {
        name,
        type,
        description: description || undefined,
        region,
        city: city || undefined,
        base_location:
          latitude && longitude ? { latitude: Number(latitude), longitude: Number(longitude) } : undefined,
        vehicle_info: vehicleInfo || undefined,
        price_estimate: priceEstimate ? Number(priceEstimate) : undefined,
        contact_phone: contactPhone,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Prestataire de transport créé avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouveau prestataire de transport">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nom" name="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            rows={3}
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
              onChange={(e) => setType(e.target.value as TransportType)}
            >
              {TRANSPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TRANSPORT_TYPE_LABELS[t]}
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
          <Input
            label="Informations véhicule"
            name="vehicle_info"
            placeholder="Ex : Berline climatisée 4 places"
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
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

        <div className={styles.row}>
          <Input
            label="Estimation de prix (XOF)"
            name="price_estimate"
            type="number"
            step="any"
            value={priceEstimate}
            onChange={(e) => setPriceEstimate(e.target.value)}
          />
          <Input
            label="Téléphone de contact"
            name="contact_phone"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : 'Créer le prestataire'}
        </Button>
      </form>
    </Modal>
  );
}
