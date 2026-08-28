import { type FormEvent, useState } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, Input } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();
  const clearSession = useAuthStore((s) => s.clearSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleError, setRoleError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setRoleError('');
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.user.role !== 'admin' && data.user.role !== 'moderator') {
            clearSession();
            setRoleError("Ce compte n'a pas accès à l'espace d'administration.");
            return;
          }
          navigate('/', { replace: true });
        },
      },
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <Shield size={24} strokeWidth={1.75} />
          </span>
          <h1 className={styles.title}>GoTours Admin</h1>
          <p className={styles.subtitle}>Connectez-vous pour gérer le contenu de la plateforme.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Adresse e-mail"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.error}>{extractApiErrorMessage(error, 'Identifiants invalides')}</p>}
          {roleError && <p className={styles.error}>{roleError}</p>}

          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
