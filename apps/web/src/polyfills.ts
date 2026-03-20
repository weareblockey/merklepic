import { Buffer } from "buffer";

// Polyfill Buffer for browser — required by Aptos/Shelby SDK dependencies
// that use Node.js Buffer API for binary data operations
globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;
