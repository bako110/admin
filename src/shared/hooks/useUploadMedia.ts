import { useMutation } from '@tanstack/react-query';

import { uploadMedia } from '../api/media.api';

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
  });
}
