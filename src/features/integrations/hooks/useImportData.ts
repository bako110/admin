import { useMutation } from '@tanstack/react-query';

import { importData } from '../api/integrations.api';

export function useImportData() {
  return useMutation({
    mutationFn: importData,
  });
}
