import { Router } from 'express';
import CryptoJS from 'crypto-js';
import { authenticate } from '../middleware/auth';

/**
 * AES Encryption Demo Endpoint
 *
 * This demonstrates symmetric AES encryption on request/response.
 *
 * PRODUCTION NOTES:
 * - Use asymmetric encryption (RSA) or JWE for key exchange
 * - Store keys in AWS KMS / HashiCorp Vault — never in env files in production
 * - For API payloads, consider TLS (HTTPS) as the primary transport security
 * - JWE (JSON Web Encryption) with RSA-OAEP + AES-256-GCM for field-level encryption
 */

const router = Router();
const ENC_KEY = process.env.ENCRYPTION_KEY ?? 'fms_aes_key_32chars_dev_only_123';

router.post('/encrypt', authenticate, (req, res) => {
  const { payload } = req.body;
  if (!payload) return res.status(400).json({ error: 'payload required' });

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    ENC_KEY
  ).toString();

  return res.json({
    encrypted,
    note: 'AES-256 symmetric encryption demo. Production would use JWE + RSA-OAEP key wrapping.',
  });
});

router.post('/decrypt', authenticate, (req, res) => {
  const { encrypted } = req.body;
  if (!encrypted) return res.status(400).json({ error: 'encrypted required' });

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENC_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return res.json({ decrypted });
  } catch {
    return res.status(400).json({ error: 'Decryption failed — invalid payload or key' });
  }
});

router.get('/example', authenticate, (req, res) => {
  const sensitive = { userId: req.user!.id, role: req.user!.role, ts: Date.now() };
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(sensitive), ENC_KEY).toString();
  const bytes = CryptoJS.AES.decrypt(encrypted, ENC_KEY);
  const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return res.json({
    original: sensitive,
    encrypted,
    decrypted,
    algorithm: 'AES-256-CBC (demo)',
    productionRecommendation: {
      transport: 'TLS 1.3',
      fieldLevel: 'JWE (RFC 7516) with RSA-OAEP + AES-256-GCM',
      keyManagement: 'AWS KMS or HashiCorp Vault',
      rotation: 'Automated key rotation every 90 days',
    },
  });
});

export default router;
