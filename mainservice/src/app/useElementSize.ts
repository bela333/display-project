import { useEffect } from "react";

export function useElementSize(
  imageRef: HTMLElement | null,
  setBounds: (rect: DOMRectReadOnly) => unknown
) {
  useEffect(() => {
    if (!imageRef) {
      return;
    }

    const observer = new ResizeObserver((entry) => {
      const rect = entry[0]?.contentRect;
      if (rect) {
        setBounds(rect);
      }
    });

    observer.observe(imageRef);
    return () => {
      observer.unobserve(imageRef);
    };
  }, [imageRef, setBounds]);
}
