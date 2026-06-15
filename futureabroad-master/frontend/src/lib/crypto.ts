/**
 * Web Crypto API Utility for End-to-End Encryption
 * Implements RSA-OAEP for encrypting sharing keys,
 * AES-GCM for encrypting document files.
 */
import { Buffer } from "buffer";

export const generateRSAKeyPair = async () => {
  return await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const exportPublicKey = async (publicKey: CryptoKey) => {
  const exported = await crypto.subtle.exportKey("spki", publicKey);
  return Buffer.from(exported).toString("base64");
};

export const importPublicKey = async (base64Key: string) => {
  const binaryDerString = Buffer.from(base64Key, "base64");
  return await crypto.subtle.importKey(
    "spki",
    binaryDerString,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
};

export const exportPrivateKey = async (privateKey: CryptoKey) => {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey);
  return Buffer.from(exported).toString("base64");
};

export const importPrivateKey = async (base64Key: string) => {
  const binaryDerString = Buffer.from(base64Key, "base64");
  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDerString,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
};

// --- PIN (PBKDF2) to Encrypt/Decrypt the RSA Private Key ---

export const deriveAESKeyFromPIN = async (pin: string, saltBase64: string) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  const salt = Buffer.from(saltBase64, "base64");
  
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// --- Encrypting the Document (AES-GCM) ---

export const generateDocumentKey = async () => {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptDocument = async (fileBuffer: ArrayBuffer, aesKey: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedFile = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    fileBuffer
  );
  
  // Prepend IV to the encrypted file buffer
  const result = new Uint8Array(iv.length + encryptedFile.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encryptedFile), iv.length);
  return result;
};

export const decryptDocument = async (encryptedFileWithIv: ArrayBuffer, aesKey: CryptoKey) => {
  const encryptedArray = new Uint8Array(encryptedFileWithIv);
  const iv = encryptedArray.slice(0, 12);
  const ciphertext = encryptedArray.slice(12);
  
  return await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ciphertext
  );
};

// --- Encrypting the AES Document Key for Sharing (RSA) ---

export const encryptAESKeyWithRSA = async (aesKey: CryptoKey, publicKey: CryptoKey) => {
  const rawKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  );
  return Buffer.from(encryptedKey).toString("base64");
};

export const decryptAESKeyWithRSA = async (encryptedAESKeyBase64: string, privateKey: CryptoKey) => {
  const encryptedKey = Buffer.from(encryptedAESKeyBase64, "base64");
  const rawKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedKey
  );
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};
