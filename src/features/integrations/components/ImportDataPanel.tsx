import { useState } from 'react';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useImportData } from '../hooks/useImportData';
import styles from './ImportDataPanel.module.css';

const ITEM_TYPES = [
  { value: 'hotels', label: 'Hôtels' },
  { value: 'restaurants', label: 'Restaurants' },
];

export function ImportDataPanel() {
  const { mutate, isPending, error, isSuccess, reset } = useImportData();
  const [itemType, setItemType] = useState(ITEM_TYPES[0].value);
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  function handleSubmit() {
    setParseError(null);
    reset();
    let items: Record<string, unknown>[];
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error('Le JSON doit être un tableau d\'objets');
      items = parsed;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'JSON invalide');
      return;
    }
    mutate({ item_type: itemType, items });
  }

  return (
    <div className={styles.panel}>
      <p className={styles.hint}>
        Importez en masse des hôtels ou restaurants au format JSON (tableau d'objets prêts à insérer).
        Chaque objet est validé par le service cible correspondant.
      </p>

      <div className={styles.field}>
        <label htmlFor="item_type" className={styles.label}>
          Type de données
        </label>
        <select
          id="item_type"
          className={styles.select}
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        >
          {ITEM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="json_items" className={styles.label}>
          Données JSON
        </label>
        <textarea
          id="json_items"
          className={styles.textarea}
          placeholder='[{ "name": "Hôtel Exemple", "region": "Centre", ... }]'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
      </div>

      {parseError && <p className={styles.errorText}>{parseError}</p>}
      {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}
      {isSuccess && <p className={styles.successText}>Import réalisé avec succès.</p>}

      <Button onClick={handleSubmit} disabled={isPending || !jsonText.trim()}>
        {isPending ? <Spinner size={18} /> : 'Importer'}
      </Button>
    </div>
  );
}
