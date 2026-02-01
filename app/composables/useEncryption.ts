import {MASTER_PUBLIC_KEY} from "#shared/constants/encryption"
import * as openpgp from "openpgp"

/**
 * Configure OpenPGP for the Edge.
 * Using the 'openpgp/web' import already prioritizes Web Crypto,
 * but we set these flags to ensure maximum performance and compatibility.
 */
openpgp.config.allowUnauthenticatedStream = true

export const useEncryption = () => {
  // Using useState for SPA navigation persistence, but clears on page reload (non-persistent)
  const isUnlocked = useState<boolean>("encryption-is-unlocked", () => false)
  const privateKey = useState<string | null>("encryption-private-key", () => null)
  const publicKey = useState<string | null>("encryption-public-key", () => null)
  const userRole = useState<string | null>("encryption-user-role", () => null)

  // KDF: Derive encryption key from password using PBKDF2
  const deriveKey = async (password: string, salt: string): Promise<string> => {
    const enc = new TextEncoder()
    const crypto = typeof window !== "undefined" ? window.crypto : (globalThis as any).crypto
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 600000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )

    const exported = await crypto.subtle.exportKey("raw", key)
    return Array.from(new Uint8Array(exported))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Called during Sign Up: Generate PGP keys with RANDOM salt
  const provisionKeys = async (password: string, email: string, name: string) => {
    // 1. Generate Random 16-byte Salt (CRITICAL SECURITY FIX)
    const saltBytes = new Uint8Array(16)
    const crypto = typeof window !== "undefined" ? window.crypto : (globalThis as any).crypto
    crypto.getRandomValues(saltBytes)
    const salt = Array.from(saltBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    // 2. Derive passphrase from password + random salt
    const derivedPassphrase = await deriveKey(password, salt)

    // 3. Generate PGP keypair
    const { privateKey: priv, publicKey: pub } = await openpgp.generateKey({
      type: "ecc",
      userIDs: [{ name, email }],
      passphrase: derivedPassphrase,
      format: "armored"
    })

    // Return keys + salt to be stored in database
    return {
      publicKey: pub,
      encryptedPrivateKey: priv,
      derivationSalt: salt
    }
  }

  // Called during Sign In: Unlock keys using password and stored salt
  const recoverKeys = async (
    password: string,
    salt: string,
    encryptedPrivKey: string,
    pubKey: string,
    role: string
  ) => {
    if (!salt) {
      throw new Error("Missing derivation salt - cannot unlock encryption keys")
    }

    const derivedPassphrase = await deriveKey(password, salt)

    try {
      const privKeyObj = await openpgp.readPrivateKey({ armoredKey: encryptedPrivKey })
      // Verify we can decrypt with the derived passphrase
      await openpgp.decryptKey({
        privateKey: privKeyObj,
        passphrase: derivedPassphrase
      })

      // Store in state/memory (non-persistent)
      privateKey.value = encryptedPrivKey
      publicKey.value = pubKey
      userRole.value = role
      setSessionPassphrase(derivedPassphrase)
      isUnlocked.value = true
    } catch (e) {
      console.error("Failed to recover keys", e)
      throw new Error("Invalid password for encryption keys")
    }
  }

  // Encrypt with Key Escrow for employees
  const encrypt = async (text: string) => {
    if (!text) return text
    if (!publicKey.value) throw new Error("Public Key missing")

    const pubKeys = [await openpgp.readKey({ armoredKey: publicKey.value })]

    // Key Escrow: If employee, also encrypt with Master Key for recovery
    if (userRole.value === "employee") {
      try {
        const masterKey = await openpgp.readKey({ armoredKey: MASTER_PUBLIC_KEY })
        pubKeys.push(masterKey)
      } catch (e) {
        console.warn("Master key not configured, skipping escrow encryption", e)
      }
    }

    return (await openpgp.encrypt({
      message: await openpgp.createMessage({ text }),
      encryptionKeys: pubKeys,
      format: "armored"
    })) as string
  }

  const decrypt = async (encryptedText: string) => {
    if (!encryptedText) return encryptedText
    if (!encryptedText.includes("BEGIN PGP MESSAGE")) return encryptedText
    if (!passphraseSession) throw new Error("Encryption locked - please sign in again")

    const privKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKey.value! })
    const decryptedKey = await openpgp.decryptKey({
      privateKey: privKeyObj,
      passphrase: passphraseSession
    })

    const message = await openpgp.readMessage({ armoredMessage: encryptedText })
    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedKey,
      format: "utf8"
    })
    return decrypted as string
  }

  return {
    isUnlocked,
    provisionKeys,
    recoverKeys,
    encrypt,
    decrypt,
    hasKeys: computed(() => !!publicKey.value)
  }
}

// Module-level variable to hold derived passphrase in memory (Client-only, non-persistent)
// This is cleared on page reload, providing session-based security
let passphraseSession: string | null = null
function setSessionPassphrase(p: string) {
  passphraseSession = p
}
