import { Plus, Trash2 } from 'lucide-react';

import { Button, Input, TagsInput } from '../../../shared/ui';
import type { RoomType } from '../types';
import formStyles from '../../../shared/ui/formLayout.module.css';
import styles from './RoomTypesEditor.module.css';

interface RoomTypesEditorProps {
  roomTypes: RoomType[];
  onChange: (roomTypes: RoomType[]) => void;
}

const EMPTY_ROOM_TYPE: RoomType = {
  name: '',
  capacity: 2,
  price_per_night: 0,
  currency: 'XOF',
  total_rooms: 1,
  amenities: [],
};

export function RoomTypesEditor({ roomTypes, onChange }: RoomTypesEditorProps) {
  function addRoomType() {
    onChange([...roomTypes, { ...EMPTY_ROOM_TYPE }]);
  }

  function updateRoomType(index: number, patch: Partial<RoomType>) {
    onChange(roomTypes.map((rt, i) => (i === index ? { ...rt, ...patch } : rt)));
  }

  function removeRoomType(index: number) {
    onChange(roomTypes.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <label className={formStyles.label}>Types de chambres et tarifs</label>
        <Button type="button" variant="secondary" size="sm" onClick={addRoomType}>
          <Plus size={14} strokeWidth={2} />
          Ajouter un type de chambre
        </Button>
      </div>

      {roomTypes.length === 0 && (
        <p className={formStyles.hint}>
          Aucun type de chambre. Sans ceci, le prix n'apparaîtra pas côté touriste.
        </p>
      )}

      {roomTypes.map((rt, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Chambre {i + 1}</span>
            <button type="button" className={styles.removeBtn} onClick={() => removeRoomType(i)} aria-label="Supprimer ce type de chambre">
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </div>

          <div className={formStyles.row}>
            <Input
              label="Nom du type de chambre"
              value={rt.name}
              onChange={(e) => updateRoomType(i, { name: e.target.value })}
              placeholder="Ex : Chambre simple, Suite"
              required
            />
            <Input
              label="Capacité (personnes)"
              type="number"
              min={1}
              value={rt.capacity}
              onChange={(e) => updateRoomType(i, { capacity: Number(e.target.value) })}
            />
          </div>

          <div className={formStyles.row}>
            <Input
              label="Prix par nuit"
              type="number"
              min={0}
              value={rt.price_per_night}
              onChange={(e) => updateRoomType(i, { price_per_night: Number(e.target.value) })}
              required
            />
            <div className={formStyles.field}>
              <label className={formStyles.label}>Devise</label>
              <select
                className={formStyles.select}
                value={rt.currency}
                onChange={(e) => updateRoomType(i, { currency: e.target.value })}
              >
                <option value="XOF">XOF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <Input
            label="Nombre de chambres disponibles"
            type="number"
            min={1}
            value={rt.total_rooms}
            onChange={(e) => updateRoomType(i, { total_rooms: Number(e.target.value) })}
          />

          <TagsInput
            label="Équipements de la chambre"
            values={rt.amenities}
            onChange={(amenities) => updateRoomType(i, { amenities })}
            placeholder="Ex : Climatisation, Wi-Fi..."
          />
        </div>
      ))}
    </div>
  );
}
