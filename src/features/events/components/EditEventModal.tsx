import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField, LocationPicker } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { BURKINA_REGIONS } from '../../../shared/config/regions';
import { useEvent, useUpdateEvent } from '../hooks/useEvents';
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS, type EventCategory } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditEventModalProps {
  eventId: string | null;
  onClose: () => void;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditEventModal({ eventId, onClose }: EditEventModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!eventId;
  const { data: detail, isLoading: isLoadingDetail } = useEvent(eventId);
  const { mutate, isPending, error } = useUpdateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('festival');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [requiresTicket, setRequiresTicket] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setTitle(detail.title);
    setDescription(detail.description);
    setCategory(detail.category);
    setRegion(detail.region);
    setCity(detail.city ?? '');
    setAddress(detail.address ?? '');
    setLatitude(String(detail.location.latitude));
    setLongitude(String(detail.location.longitude));
    setStartDate(toDatetimeLocal(detail.start_date));
    setEndDate(detail.end_date ? toDatetimeLocal(detail.end_date) : '');
    setTicketPrice(detail.ticket_price !== undefined && detail.ticket_price !== null ? String(detail.ticket_price) : '');
    setRequiresTicket(detail.requires_ticket);
    setPhotos(detail.photos);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!eventId) return;
    if (!latitude || !longitude) {
      push({ variant: 'error', message: 'Indique une localisation (carte ou lien Google Maps).' });
      return;
    }
    mutate(
      {
        id: eventId,
        payload: {
          title,
          description,
          category,
          region,
          city: city || undefined,
          address: address || undefined,
          location: { latitude: Number(latitude), longitude: Number(longitude) },
          start_date: new Date(startDate).toISOString(),
          end_date: endDate ? new Date(endDate).toISOString() : undefined,
          ticket_price: ticketPrice ? Number(ticketPrice) : undefined,
          requires_ticket: requiresTicket,
          photos,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Événement mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier l'événement">
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
              <label htmlFor="category" className={styles.label}>
                Catégorie
              </label>
              <select
                id="category"
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {EVENT_CATEGORY_LABELS[cat]}
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
              label="Date de début"
              name="start_date"
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Date de fin"
              name="end_date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Prix du billet (XOF)"
              name="ticket_price"
              type="number"
              step="any"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
            />
            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={requiresTicket} onChange={(e) => setRequiresTicket(e.target.checked)} />
              Billet requis
            </label>
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
