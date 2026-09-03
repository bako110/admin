import { Plus, Trash2 } from 'lucide-react';

import { Button, Input } from '../../../shared/ui';
import type { Offer } from '../types';
import formStyles from '../../../shared/ui/formLayout.module.css';
import styles from './RoomTypesEditor.module.css';

interface OffersEditorProps {
  offers: Offer[];
  onChange: (offers: Offer[]) => void;
}

const EMPTY_OFFER: Offer = {
  title: '',
  description: '',
  discount_percent: undefined,
  valid_from: undefined,
  valid_until: undefined,
};

function toDateInputValue(value?: string): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function OffersEditor({ offers, onChange }: OffersEditorProps) {
  function addOffer() {
    onChange([...offers, { ...EMPTY_OFFER }]);
  }

  function updateOffer(index: number, patch: Partial<Offer>) {
    onChange(offers.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }

  function removeOffer(index: number) {
    onChange(offers.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <label className={formStyles.label}>Offres et promotions</label>
        <Button type="button" variant="secondary" size="sm" onClick={addOffer}>
          <Plus size={14} strokeWidth={2} />
          Ajouter une offre
        </Button>
      </div>

      {offers.length === 0 && <p className={formStyles.hint}>Aucune offre en cours pour cet hébergement.</p>}

      {offers.map((offer, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Offre {i + 1}</span>
            <button type="button" className={styles.removeBtn} onClick={() => removeOffer(i)} aria-label="Supprimer cette offre">
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </div>

          <Input
            label="Titre de l'offre"
            value={offer.title}
            onChange={(e) => updateOffer(i, { title: e.target.value })}
            placeholder="Ex : Promo basse saison"
            required
          />

          <div className={formStyles.field}>
            <label className={formStyles.label}>Description</label>
            <textarea
              className={formStyles.textarea}
              rows={2}
              value={offer.description ?? ''}
              onChange={(e) => updateOffer(i, { description: e.target.value || undefined })}
            />
          </div>

          <div className={formStyles.row}>
            <Input
              label="Réduction (%)"
              type="number"
              min={0}
              max={100}
              value={offer.discount_percent ?? ''}
              onChange={(e) =>
                updateOffer(i, { discount_percent: e.target.value === '' ? undefined : Number(e.target.value) })
              }
            />
          </div>

          <div className={formStyles.row}>
            <Input
              label="Valable du"
              type="date"
              value={toDateInputValue(offer.valid_from)}
              onChange={(e) => updateOffer(i, { valid_from: e.target.value || undefined })}
            />
            <Input
              label="Valable jusqu'au"
              type="date"
              value={toDateInputValue(offer.valid_until)}
              onChange={(e) => updateOffer(i, { valid_until: e.target.value || undefined })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
