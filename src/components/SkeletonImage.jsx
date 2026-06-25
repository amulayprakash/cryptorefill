import React, { useState } from 'react';

/**
 * SkeletonImage — drops in place of a plain <img> and shows
 * a shimmer skeleton while the image is loading.
 *
 * Props:
 *  - src, alt, className, style, onError  → forwarded to <img>
 *  - skeletonClassName → extra classes for the skeleton overlay (optional)
 *  - containerClassName → classes for the outer wrapper   (optional)
 *  - containerStyle     → inline styles for the outer wrapper (optional)
 */
export default function SkeletonImage({
  src,
  alt,
  className = '',
  style = {},
  onError,
  skeletonClassName = '',
  containerClassName = '',
  containerStyle = {},
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleLoad = () => setLoaded(true);

  const handleError = (e) => {
    setErrored(true);
    setLoaded(true); // hide skeleton even on error (fallback img will show)
    if (onError) onError(e);
  };

  return (
    <div
      className={`skeleton-image-wrapper ${containerClassName}`}
      style={{ position: 'relative', overflow: 'hidden', ...containerStyle }}
    >
      {/* Skeleton shimmer — visible until image loads */}
      {!loaded && (
        <div
          className={`skeleton-shimmer ${skeletonClassName}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
