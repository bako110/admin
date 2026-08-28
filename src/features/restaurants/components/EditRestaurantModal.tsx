import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useRestaurant, useUpdateRestaurant } from '../hooks/useRestaurants';
import { ESTABLISHMENT_TYPES, ESTABLISHMENT_TYPE_LABELS, type EstablishmentType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditRestaurantModalProps {
  restaurantId: string | null;
  onClose: () => void;
}

export function EditRestaurantModal({ restaurantId, onClose }: EditRestaurantModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!restaurantId;
  const { data: detail, isLoading: isLoadingDetail } = useRestaurant(restaurantId);
  const { mutate, isPending, error } = useUpdateRestaurant();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EstablishmentType>('restaurant');
  const [cuisineStyle, setCuisineStyle] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setName(detail.name);
    setDescription(detail.description);
    setType(detail.type);
    setCuisineStyle(detail.cuisine_style ?? '');
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setAddress(detail.address ?? '');
    setLatitude(String(detail.location.latitude));
    setLongitude(String(detail.location.longitude));
    setContactPhone(detail.contact_phone ?? '');
    setPhotos(detail.photos);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!restaurantId) return;
    if (!latitude || !longitude) {
      push({ variant: 'error', message: 'Indique une localisation (carte ou lien Google Maps).' });
      return;
    }
    mutate(
      {
        id: restaurantId,
        payload: {
          name,
          description,
          type,
          cuisine_style: cuisineStyle || undefined,
          region,
          city: city || undefined,
          address: address || undefined,
          location: { latitude: Number(latitude), longitude: Number(longitude) },
          contact_phone: contactPhone || undefined,
          photos,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Restaurant mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le restaurant">
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
                onChange={(e) => setType(e.target.value as EstablishmentType)}
              >
                {ESTABLISHMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ESTABLISHMENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Style de cuisine"
              name="cuisine_style"
              placeholder="Ex : Traditionnelle burkinabè"
              value={cuisineStyle}
              onChange={(e) => setCuisineStyle(e.target.value)}
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

          <PhotoUploadField
            label="Photos"
            photos={photos}
            onChange={setPhotos}
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
