import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner, PhotoUploadField } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  FULFILLMENT_MODES,
  FULFILLMENT_MODE_LABELS,
  type ProductCategory,
  type FulfillmentMode,
} from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface EditProductModalProps {
  productId: string | null;
  onClose: () => void;
}

export function EditProductModal({ productId, onClose }: EditProductModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!productId;
  const { data: detail, isLoading: isLoadingDetail } = useProduct(productId);
  const { mutate, isPending, error } = useUpdateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('tissus_vetements');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('les_deux');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!detail) return;
    setName(detail.name);
    setDescription(detail.description);
    setCategory(detail.category);
    setPrice(String(detail.price));
    setStockQuantity(String(detail.stock_quantity));
    setFulfillmentMode(detail.fulfillment_mode);
    setPhotos(detail.photos);
  }, [detail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId) return;
    mutate(
      {
        id: productId,
        payload: {
          name,
          description,
          category,
          price: Number(price),
          stock_quantity: stockQuantity ? Number(stockQuantity) : undefined,
          fulfillment_mode: fulfillmentMode,
          photos,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Produit mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le produit">
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
              minLength={5}
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
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {PRODUCT_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Prix (XOF)"
              name="price"
              type="number"
              step="any"
              required
              min={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Stock disponible"
              name="stock_quantity"
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
            <div className={styles.field}>
              <label htmlFor="fulfillment_mode" className={styles.label}>
                Mode de livraison
              </label>
              <select
                id="fulfillment_mode"
                className={styles.select}
                value={fulfillmentMode}
                onChange={(e) => setFulfillmentMode(e.target.value as FulfillmentMode)}
              >
                {FULFILLMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {FULFILLMENT_MODE_LABELS[mode]}
                  </option>
                ))}
              </select>
            </div>
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
