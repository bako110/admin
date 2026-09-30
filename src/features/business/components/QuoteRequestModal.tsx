import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Users, Calendar, MapPin, Clock, Check, X, StickyNote, Receipt } from 'lucide-react';
import clsx from 'clsx';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
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
import formStyles from '../../../shared/ui/formLayout.module.css';
import styles from './QuoteRequestModal.module.css';

interface QuoteRequestModalProps {
  quoteId: string | null;
  onClose: () => void;
}

/** Étape atteinte : soumise → examen → devis → décision. */
const STEP_OF: Record<QuoteRequestStatus, number> = { submitted: 0, in_review: 1, quoted: 2, accepted: 3, declined: 3 };
const STEPS = ['Soumise', 'Examen', 'Devis envoyé', 'Décision'];

function formatDate(iso?: string, withYear = true) {
  return iso
    ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', ...(withYear ? { year: 'numeric' } : {}) })
    : '—';
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

  const step = quote ? STEP_OF[quote.status] : 0;
  const declined = quote?.status === 'declined';
  const invoiceTotal = (invoices ?? []).reduce((sum, inv) => sum + inv.amount, 0);
  const invoicePaid = (invoices ?? []).filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Modal open={open} onClose={onClose} title="Demande de devis entreprise" size="lg">
      {isLoading && (
        <div className={styles.loading}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && quote && (
        <div className={styles.content}>
          {/* En-tête */}
          <div className={clsx(styles.head, styles[`status_${quote.status}`])}>
            <div className={styles.headTop}>
              <div>
                <h3 className={styles.company}>{quote.company_name}</h3>
                <span className={styles.received}>Reçue le {formatDate(quote.created_at)}</span>
              </div>
              <span className={styles.statusPill}>
                <span className={styles.statusDot} aria-hidden="true" />
                {QUOTE_REQUEST_STATUS_LABELS[quote.status]}
              </span>
            </div>

            <ol className={styles.steps} aria-label="Progression de la demande">
              {STEPS.map((label, i) => {
                const reached = i <= step;
                return (
                  <li key={label} className={clsx(styles.step, reached && styles.stepReached, i === step && styles.stepCurrent)}>
                    <span className={styles.stepDot}>
                      {reached && i < step && <Check size={11} strokeWidth={3.5} />}
                      {i === STEPS.length - 1 && reached && (declined ? <X size={11} strokeWidth={3.5} /> : <Check size={11} strokeWidth={3.5} />)}
                    </span>
                    <span className={styles.stepLabel}>{label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Informations clés */}
          <div className={styles.infoGrid}>
            <div className={styles.info}>
              <Users size={16} strokeWidth={2} />
              <span className={styles.infoValue}>{quote.participant_count}</span>
              <span className={styles.infoLabel}>Participants</span>
            </div>
            <div className={styles.info}>
              <Calendar size={16} strokeWidth={2} />
              <span className={styles.infoValue}>{formatDate(quote.event_date, false)}</span>
              <span className={styles.infoLabel}>Date de l'événement</span>
            </div>
            <div className={styles.info}>
              <MapPin size={16} strokeWidth={2} />
              <span className={styles.infoValue}>{quote.region ?? '—'}</span>
              <span className={styles.infoLabel}>Région</span>
            </div>
            <div className={styles.info}>
              <Clock size={16} strokeWidth={2} />
              <span className={styles.infoValue}>{formatDate(quote.created_at, false)}</span>
              <span className={styles.infoLabel}>Date de la demande</span>
            </div>
          </div>

          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Services demandés</h4>
            <div className={styles.tags}>
              {quote.service_types.map((t) => (
                <span key={t} className={styles.tag}>
                  {BUSINESS_SERVICE_TYPE_LABELS[t]}
                </span>
              ))}
            </div>
          </section>

          {quote.notes && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <StickyNote size={15} strokeWidth={2} />
                Notes du client
              </h4>
              <blockquote className={styles.notes}>{quote.notes}</blockquote>
            </section>
          )}

          {/* Réponse */}
          <section className={clsx(styles.section, styles.answer)}>
            <h4 className={styles.sectionTitle}>Votre réponse</h4>
            <form onSubmit={handleSubmit} className={styles.answerForm}>
              <div className={formStyles.field}>
                <span className={formStyles.label}>Statut de la demande</span>
                <div className={styles.segments} role="radiogroup" aria-label="Statut de la demande">
                  {QUOTE_REQUEST_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={status === s}
                      className={clsx(styles.segment, styles[`segment_${s}`], status === s && styles.segmentActive)}
                      onClick={() => setStatus(s)}
                    >
                      {QUOTE_REQUEST_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={formStyles.row}>
                <Input
                  label="Montant du devis"
                  type="number"
                  min={0}
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(e.target.value)}
                />
                <div className={formStyles.field}>
                  <label className={formStyles.label} htmlFor="quote-currency">
                    Devise
                  </label>
                  <select id="quote-currency" className={formStyles.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="XOF">XOF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              {error && <p className={formStyles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

              <Button type="submit" fullWidth disabled={isUpdating}>
                {isUpdating ? <Spinner size={18} /> : 'Enregistrer la réponse'}
              </Button>
            </form>
          </section>

          {/* Factures */}
          <section className={styles.section}>
            <div className={styles.invoiceHead}>
              <h4 className={styles.sectionTitle}>
                <Receipt size={15} strokeWidth={2} />
                Factures
              </h4>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowInvoiceForm((v) => !v)}>
                <Plus size={14} strokeWidth={2} />
                Nouvelle facture
              </Button>
            </div>

            {invoices && invoices.length === 0 && <p className={styles.emptyInvoices}>Aucune facture pour cette demande.</p>}

            {invoices && invoices.length > 0 && (
              <>
                <ul className={styles.invoices}>
                  {invoices.map((inv) => (
                    <li key={inv.id} className={clsx(styles.invoice, styles[`invoice_${inv.status}`])}>
                      <div className={styles.invoiceMain}>
                        <span className={styles.invoiceAmount}>
                          {inv.amount.toLocaleString('fr-FR')} <small>{inv.currency}</small>
                        </span>
                        <span className={styles.invoiceDue}>{inv.due_date ? `Échéance : ${formatDate(inv.due_date)}` : 'Sans échéance'}</span>
                      </div>
                      <select
                        className={clsx(formStyles.select, styles.invoiceSelect)}
                        value={inv.status}
                        aria-label="Statut de la facture"
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
                    </li>
                  ))}
                </ul>
                <div className={styles.invoiceTotals}>
                  <span>
                    Total facturé <strong>{invoiceTotal.toLocaleString('fr-FR')} {invoices[0].currency}</strong>
                  </span>
                  <span>
                    Payé <strong className={styles.paid}>{invoicePaid.toLocaleString('fr-FR')} {invoices[0].currency}</strong>
                  </span>
                </div>
              </>
            )}

            {showInvoiceForm && (
              <form onSubmit={handleCreateInvoice} className={styles.invoiceForm}>
                <div className={formStyles.row}>
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
          </section>
        </div>
      )}
    </Modal>
  );
}
