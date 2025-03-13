import { useEffect } from "react";

export function useElementSize(
  imageRef: HTMLElement | null,
  roomID: string,
  screenID: number,
  setBounds: (
    roomID: string,
    screenID: number,
    rect: DOMRectReadOnly
  ) => unknown
) {
  useEffect(() => {
    if (!imageRef || !roomID || !screenID) {
      return;
    }

    const observer = new ResizeObserver((entry) => {
      const rect = entry[0]?.contentRect;
      if (rect) {
        setBounds(roomID, screenID, rect);
      }
    });

    observer.observe(imageRef);
    return () => {
      observer.unobserve(imageRef);
    };
  }, [imageRef, roomID, screenID, setBounds]);
}
