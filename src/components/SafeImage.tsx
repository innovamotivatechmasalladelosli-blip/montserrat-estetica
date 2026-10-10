import React, { useEffect, useState } from 'react';
import {
  allowsExternalImages,
  COOKIE_PREFERENCES_EVENT,
  COOKIE_PREFERENCES_KEY,
} from '../lib/cookiePreferences';

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/** Imagen que evita huecos cuando un CDN externo falla o bloquea la solicitud. */
export function SafeImage({ src, onError, ...props }: SafeImageProps) {
  const [externalImagesAllowed, setExternalImagesAllowed] = useState(allowsExternalImages);

  useEffect(() => {
    const refresh = () => setExternalImagesAllowed(allowsExternalImages());
    const refreshFromStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_PREFERENCES_KEY) refresh();
    };
    window.addEventListener(COOKIE_PREFERENCES_EVENT, refresh);
    window.addEventListener('storage', refreshFromStorage);
    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, refresh);
      window.removeEventListener('storage', refreshFromStorage);
    };
  }, []);

  const isExternalUrl = typeof src === 'string' && /^https?:\/\//i.test(src);
  const resolvedSrc = isExternalUrl && !externalImagesAllowed ? '/fallback-image.svg' : src || '/fallback-image.svg';

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied !== 'true') {
      image.dataset.fallbackApplied = 'true';
      image.src = '/fallback-image.svg';
    }
    onError?.(event);
  };

  return <img {...props} src={resolvedSrc} onError={handleError} />;
}
