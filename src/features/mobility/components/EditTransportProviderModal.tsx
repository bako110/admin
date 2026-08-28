import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useTransportProvider, useUpdateTransportProvider } from '../hooks/useTransportProviders';
import { TRANSPORT_TYPES, TRANSPORT_TYPE_LABELS, type TransportType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditTransportProviderModalProps {
  providerId: string | null;
  onClose: () => void;
}

export function EditTransportProviderModal({ providerId, onClose }: EditTransportProviderModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!providerId;
  const { data: detail, isLoading: isLoadingDetail } = useTransportProvider(providerId);
  const { mutate, isPending, error } = useUpdateTransportProvider();

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

  useEffect(() => {
    if (!detail) return;
    setName(detail.name);
    setType(detail.type);
    setDescription(detail.description ?? '');
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setLatitude(detail.base_location ? String(detail.base_location.latitude) : '');
    setLongitude(detail.base_location ? String(detail.base_location.longitude) : '');
    setVehicleInfo(detail.vehicle_info ?? '');
    setPriceEstimate(
      detail.price_estimate !== undefined && detail.price_estimate !== null ? String(detail.price_estimate) : '',
    );
    setContactPhone(detail.contact_phone);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!providerId) return;
    mutate(
      {
        id: providerId,
        payload: {
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
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Prestataire de transport mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le prestataire de transport">
      {isLoadingDetail && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoadingDetail && detail && (
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
            {isPending ? <Spinner size={18} /> : 'Enregistrer les modifications'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
