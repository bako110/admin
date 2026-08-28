import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

import { Spinner } from './Spinner';
import { useUploadMedia } from '../hooks/useUploadMedia';
import styles from './PhotoUploadField.module.css';

interface PhotoUploadFieldProps {
  label: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  onError?: (message: string) => void;
}

export function PhotoUploadField({ label, photos, onChange, onError }: PhotoUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadMedia();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(file, {
      onSuccess: (result) => onChange([...photos, result.url]),
      onError: (err) => onError?.(err instanceof Error ? err.message : 'Échec du téléversement'),
    });
    e.target.value = '';
  }

  function handleRemove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <div key={photo} className={styles.thumb}>
            <img src={photo} alt="" />
            <button type="button" className={styles.removeBtn} onClick={() => handleRemove(i)}>
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? <Spinner size={20} /> : <ImagePlus size={20} strokeWidth={1.75} />}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileSelect}
      />
    </div>
  );
}
