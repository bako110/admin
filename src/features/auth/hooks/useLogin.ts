import { useMutation } from '@tanstack/react-query';

import { login } from '../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
    },
  });
}
