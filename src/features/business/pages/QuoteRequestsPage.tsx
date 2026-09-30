import { useMemo, useState } from 'react';
import { Search, Inbox, Hourglass, FileCheck2, Wallet, Briefcase, Users, Calendar, MapPin } from 'lucide-react';
import clsx from 'clsx';

import { Spinner, EmptyResults } from '../../../shared/ui';
import { useQuoteRequests } from '../hooks/useQuoteRequests';
import { QuoteRequestModal } from '../components/QuoteRequestModal';
import {
  BUSINESS_SERVICE_TYPE_LABELS,
  QUOTE_REQUEST_STATUS_LABELS,
  type QuoteRequest,
  type QuoteRequestStatus,
} from '../types';
import styles from './QuoteRequestsPage.module.css';

type Filter = 'all' | 'todo' | 'quoted' | 'accepted' | 'declined';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'todo', label: 'À traiter' },
  { key: 'quoted', label: 'Devis envoyés' },
  { key: 'accepted', label: 'Acceptées' },
  { key: 'declined', label: 'Refusées' },
];

function filterOf(status: QuoteRequestStatus): Exclude<Filter, 'all'> {
  if (status === 'submitted' || status === 'in_review') return 'todo';
  return status;
}

function formatDate(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

export function QuoteRequestsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // On charge toutes les demandes une fois : filtres, compteurs et totaux se calculent côté client.
  const { data, isLoading, isError, refetch } = useQuoteRequests();

  const quotes = useMemo(() => data ?? [], [data]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: quotes.length, todo: 0, quoted: 0, accepted: 0, declined: 0 };
    quotes.forEach((q) => {
      c[filterOf(q.status)] += 1;
    });
    return c;
  }, [quotes]);

  // Montant cumulé des devis acceptés (par devise : on n'additionne jamais des devises différentes).
  const acceptedTotals = useMemo(() => {
    const totals = new Map<string, number>();
    quotes
      .filter((q) => q.status === 'accepted' && q.quoted_amount != null)
      .forEach((q) => totals.set(q.currency, (totals.get(q.currency) ?? 0) + (q.quoted_amount ?? 0)));
    return [...totals.entries()];
  }, [quotes]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return quotes
      .filter((q) => filter === 'all' || filterOf(q.status) === filter)
      .filter((q) => !term || q.company_name.toLowerCase().includes(term) || (q.region ?? '').toLowerCase().includes(term))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [quotes, filter, search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tourisme d'affaires</h1>
          <p className={styles.subtitle}>Demandes de devis groupés : séminaires, congrès, team building.</p>
        </div>
        <label className={styles.search}>
          <Search size={16} strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher une demande"
          />
        </label>
      </div>

      {/* Indicateurs */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={clsx(styles.statIcon, styles.toneBlue)}>
            <Inbox size={18} strokeWidth={2} />
          </span>
          <span className={styles.statValue}>{counts.all}</span>
          <span className={styles.statLabel}>Demandes reçues</span>
        </div>
        <div className={clsx(styles.stat, counts.todo > 0 && styles.statAlert)}>
          <span className={clsx(styles.statIcon, styles.toneAmber)}>
            <Hourglass size={18} strokeWidth={2} />
          </span>
          <span className={styles.statValue}>{counts.todo}</span>
          <span className={styles.statLabel}>À traiter</span>
        </div>
        <div className={styles.stat}>
          <span className={clsx(styles.statIcon, styles.toneBrand)}>
            <FileCheck2 size={18} strokeWidth={2} />
          </span>
          <span className={styles.statValue}>{counts.quoted}</span>
          <span className={styles.statLabel}>Devis en attente de réponse</span>
        </div>
        <div className={styles.stat}>
          <span className={clsx(styles.statIcon, styles.toneGreen)}>
            <Wallet size={18} strokeWidth={2} />
          </span>
          <span className={styles.statValue}>
            {acceptedTotals.length === 0
              ? '0'
              : acceptedTotals.map(([cur, amount]) => `${amount.toLocaleString('fr-FR')} ${cur}`).join(' · ')}
          </span>
          <span className={styles.statLabel}>
            Acceptés ({counts.accepted} {counts.accepted > 1 ? 'demandes' : 'demande'})
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className={styles.filters} role="tablist" aria-label="Filtrer les demandes">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={clsx(styles.filterTab, filter === key && styles.filterTabActive)}
            onClick={() => setFilter(key)}
          >
            {label}
            <span className={styles.filterCount}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && visible.length === 0 && (
        <EmptyResults
          variant="empty"
          title="Aucune demande"
          text={quotes.length === 0 ? 'Aucune demande de devis pour le moment.' : 'Aucune demande ne correspond à ce filtre.'}
        />
      )}

      {!isLoading && !isError && visible.length > 0 && (
        <ul className={styles.list}>
          {visible.map((q: QuoteRequest) => (
            <li key={q.id}>
              <button type="button" className={clsx(styles.row, styles[`status_${q.status}`])} onClick={() => setSelectedId(q.id)}>
                <span className={styles.avatar}>
                  <Briefcase size={18} strokeWidth={1.75} />
                </span>

                <span className={styles.main}>
                  <span className={styles.company}>{q.company_name}</span>
                  <span className={styles.tags}>
                    {q.service_types.slice(0, 3).map((s) => (
                      <span key={s} className={styles.tag}>
                        {BUSINESS_SERVICE_TYPE_LABELS[s]}
                      </span>
                    ))}
                    {q.service_types.length > 3 && <span className={styles.tag}>+{q.service_types.length - 3}</span>}
                  </span>
                </span>

                <span className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Users size={14} strokeWidth={2} />
                    {q.participant_count}
                  </span>
                  <span className={styles.metaItem}>
                    <Calendar size={14} strokeWidth={2} />
                    {formatDate(q.event_date)}
                  </span>
                  <span className={styles.metaItem}>
                    <MapPin size={14} strokeWidth={2} />
                    {q.region ?? '—'}
                  </span>
                </span>

                <span className={styles.amount}>
                  {q.quoted_amount != null ? (
                    <>
                      {q.quoted_amount.toLocaleString('fr-FR')} <small>{q.currency}</small>
                    </>
                  ) : (
                    <span className={styles.noAmount}>Pas de devis</span>
                  )}
                </span>

                <span className={styles.status}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  {QUOTE_REQUEST_STATUS_LABELS[q.status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <QuoteRequestModal quoteId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
