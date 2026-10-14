import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";

window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList;
