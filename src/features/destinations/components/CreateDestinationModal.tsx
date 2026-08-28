import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useCreateDestination } from '../hooks/useDestinations';
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORY_LABELS, type DestinationCategory } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateDestinationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDestinationModal({ open, onClose }: CreateDestinationModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateDestination();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DestinationCategory>('site_naturel');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [priceInfo, setPriceInfo] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  function resetAndClose() {
    setName('');
    setDescription('');
    setCategory('site_naturel');
    setRegion(BURKINA_REGIONS[0]);
    setCity('');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setPriceInfo('');
    setContactPhone('');
    setPhotos([]);
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
        description,
        category,
        region,
        city: city || undefined,
        address: address || undefined,
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        price_info: priceInfo || undefined,
        contact_phone: contactPhone || undefined,
        photos,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Destination créée avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouvelle destination">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nom" name="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />

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
            <label htmlFor="category" className={styles.label}>
              Catégorie
            </label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as DestinationCategory)}
            >
              {DESTINATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {DESTINATION_CATEGORY_LABELS[cat]}
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
            label="Infos tarifaires"
            name="price_info"
            placeholder="Ex : Entrée gratuite"
            value={priceInfo}
            onChange={(e) => setPriceInfo(e.target.value)}
          />
          <Input
            label="Téléphone de contact"
            name="contact_phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <PhotoUploadField
          label="Photos"
          photos={photos}
          onChange={setPhotos}
          onError={(msg) => push({ variant: 'error', message: msg })}
        />

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : 'Créer la destination'}
        </Button>
      </form>
    </Modal>
  );
}
