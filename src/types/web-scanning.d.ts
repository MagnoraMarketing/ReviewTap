// Minimal ambient types for two browser APIs not yet in TypeScript's DOM lib:
// Web NFC (Chrome on Android only) and the Shape Detection API's
// BarcodeDetector (Chrome/Edge; partial Safari support). Both are used only
// behind runtime feature detection - see NfcDeviceWriter.tsx.

interface NDEFRecordInit {
  recordType: "url" | "text" | "mime" | "empty" | "unknown" | "absolute-url" | "smart-poster";
  data?: string;
  mediaType?: string;
}

interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

interface NDEFMessage {
  records: ReadonlyArray<{ recordType: string; mediaType: string | null; data?: DataView }>;
}

interface NDEFReadingEvent extends Event {
  message: NDEFMessage;
  serialNumber: string;
}

interface NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(message: { records: NDEFRecordInit[] } | string, options?: NDEFWriteOptions): Promise<void>;
  onreading: ((this: NDEFReader, ev: NDEFReadingEvent) => unknown) | null;
  onreadingerror: ((this: NDEFReader, ev: Event) => unknown) | null;
  addEventListener(
    type: "reading",
    listener: (this: NDEFReader, ev: NDEFReadingEvent) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: "readingerror",
    listener: (this: NDEFReader, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: "reading" | "readingerror",
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare const NDEFReader: {
  prototype: NDEFReader;
  new (): NDEFReader;
};

interface DetectedBarcode {
  rawValue: string;
  format: string;
}

interface BarcodeDetector {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}

declare const BarcodeDetector: {
  prototype: BarcodeDetector;
  new (options?: { formats: string[] }): BarcodeDetector;
  getSupportedFormats(): Promise<string[]>;
};

interface Window {
  NDEFReader?: typeof NDEFReader;
  BarcodeDetector?: typeof BarcodeDetector;
}
