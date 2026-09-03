import { useEffect, useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';

import { Modal, Button, Input, Spinner, Badge } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useQuoteRequest, useUpdateQuoteRequest, useInvoicesForQuote, useCreateInvoice, useUpdateInvoiceStatus } from '../hooks/useQuoteRequests';
import {
  BUSINESS_SERVICE_TYPE_LABELS,
  QUOTE_REQUEST_STATUSES,
  QUOTE_REQUEST_STATUS_LABELS,
  INVOICE_STATUSES,
  INVOICE_STATUS_LABELS,
  type QuoteRequestStatus,
  type InvoiceStatus,
} from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface QuoteRequestModalProps {
  quoteId: string | null;
  onClose: () => void;
}

export function QuoteRequestModal({ quoteId, onClose }: QuoteRequestModalProps) {
  const push = useToastStore((s) => s.push);
  const open = !!quoteId;
  const { data: quote, isLoading } = useQuoteRequest(quoteId);
  const { mutate: updateQuote, isPending: isUpdating, error } = useUpdateQuoteRequest();
  const { data: invoices } = useInvoicesForQuote(quoteId);
  const { mutate: createInvoice, isPending: isCreatingInvoice } = useCreateInvoice();
  const { mutate: updateInvoiceStatusMutation } = useUpdateInvoiceStatus();

  const [status, setStatus] = useState<QuoteRequestStatus>('submitted');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');

  useEffect(() => {
    if (!quote) return;
    setStatus(quote.status);
    setQuotedAmount(quote.quoted_amount != null ? String(quote.quoted_amount) : '');
    setCurrency(quote.currency);
  }, [quote]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!quoteId) return;
    updateQuote(
      { id: quoteId, payload: { status, quoted_amount: quotedAmount ? Number(quotedAmount) : undefined, currency } },
      {
        onSuccess: () => push({ variant: 'success', message: 'Demande de devis mise à jour avec succès' }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  function handleCreateInvoice(e: FormEvent) {
    e.preventDefault();
    if (!quoteId || !invoiceAmount) return;
    createInvoice(
      {
        quote_request_id: quoteId,
        amount: Number(invoiceAmount),
        currency,
        due_date: invoiceDueDate || undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Facture créée avec succès' });
          setShowInvoiceForm(false);
          setInvoiceAmount('');
          setInvoiceDueDate('');
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Demande de devis entreprise">
      {isLoading && (
        <div className={styles.form}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && quote && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Entreprise</label>
            <p>{quote.company_name}</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Services demandés</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quote.service_types.map((t) => (
                <Badge key={t} tone="brand">
                  {BUSINESS_SERVICE_TYPE_LABELS[t]}
                </Badge>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Région</label>
              <p>{quote.region ?? '—'}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Participants</label>
              <p>{quote.participant_count}</p>
            </div>
          </div>

          {quote.notes && (
            <div className={styles.field}>
              <label className={styles.label}>Notes du client</label>
              <p>{quote.notes}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="status" className={styles.label}>
                  Statut
                </label>
                <select
                  id="status"
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as QuoteRequestStatus)}
                >
                  {QUOTE_REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {QUOTE_REQUEST_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <Input
                label="Montant du devis"
                type="number"
                min={0}
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
              />
              <div className={styles.field}>
                <label className={styles.label}>Devise</label>
                <select className={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="XOF">XOF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

            <Button type="submit" fullWidth disabled={isUpdating}>
              {isUpdating ? <Spinner size={18} /> : 'Enregistrer la réponse'}
            </Button>
          </form>

          <div className={styles.field}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className={styles.label}>Factures</label>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowInvoiceForm((v) => !v)}>
                <Plus size={14} strokeWidth={2} />
                Nouvelle facture
              </Button>
            </div>

            {invoices && invoices.length === 0 && <p className={styles.hint}>Aucune facture pour cette demande.</p>}

            {invoices && invoices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span>
                      {inv.amount.toLocaleString('fr-FR')} {inv.currency}
                    </span>
                    <select
                      className={styles.select}
                      value={inv.status}
                      onChange={(e) =>
                        updateInvoiceStatusMutation(
                          { id: inv.id, status: e.target.value, quoteId: quoteId as string },
                          {
                            onSuccess: () => push({ variant: 'success', message: 'Statut de facture mis à jour' }),
                            onError: (err) =>
                              push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
                          },
                        )
                      }
                    >
                      {INVOICE_STATUSES.map((s: InvoiceStatus) => (
                        <option key={s} value={s}>
                          {INVOICE_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {showInvoiceForm && (
              <form onSubmit={handleCreateInvoice} className={styles.form} style={{ marginTop: '12px' }}>
                <div className={styles.row}>
                  <Input
                    label="Montant"
                    type="number"
                    min={0}
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                  />
                  <Input
                    label="Date d'échéance"
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                  />
                </div>
                <Button type="submit" fullWidth disabled={isCreatingInvoice}>
                  {isCreatingInvoice ? <Spinner size={18} /> : 'Créer la facture'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
