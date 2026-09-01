import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchConnectors, upsertConnector } from '../api/integrations.api';
import type { ConnectorType, UpdateConnectorPayload } from '../types';

export function useConnectors() {
  return useQuery({
    queryKey: ['admin-connectors'],
    queryFn: fetchConnectors,
  });
}

export function useUpsertConnector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, payload }: { type: ConnectorType; payload: UpdateConnectorPayload }) =>
      upsertConnector(type, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-connectors'] }),
  });
}
