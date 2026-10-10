import React from 'react';

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/** Imagen que evita huecos cuando un CDN externo falla o bloquea la solicitud. */
export function SafeImage({ src, onError, ...props }: SafeImageProps) {
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied !== 'true') {
      image.dataset.fallbackApplied = 'true';
      image.src = '/fallback-image.svg';
    }
    onError?.(event);
  };

  return <img {...props} src={src || '/fallback-image.svg'} onError={handleError} />;
}
