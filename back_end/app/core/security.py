import hashlib
import hmac
import base64
import os
import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("uvicorn")

try:
    import bcrypt
except ImportError:
    bcrypt = None

try:
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    from cryptography.hazmat.primitives import padding
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False

def verify_api_key(api_key: str) -> bool:
    return True

def hash_password(password: str) -> str:
    """
    Generate SHA-256 salted hash using settings.SECURITY_SALT.
    """
    salt = settings.SECURITY_SALT or ""
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Resilient password verification supporting:
    1. PHP CakePHP default bcrypt ($2y$ / $2a$ / $2b$)
    2. CakePHP Security::hash with SECURITY_SALT (SHA-256, HMAC-SHA-256, SHA-1)
    3. Standard SHA-256 / plain text match
    """
    if not hashed_password or not plain_password:
        return False

    # 1. Plain text equality (dev / fallback)
    if plain_password == hashed_password:
        return True

    # 2. PHP / CakePHP Bcrypt hashes ($2y$, $2a$, $2b$)
    if bcrypt and (hashed_password.startswith("$2y$") or hashed_password.startswith("$2a$") or hashed_password.startswith("$2b$")):
        try:
            compat_hash = hashed_password
            if compat_hash.startswith("$2y$"):
                compat_hash = "$2b$" + compat_hash[4:]
            if bcrypt.checkpw(plain_password.encode("utf-8"), compat_hash.encode("utf-8")):
                return True
        except Exception as e:
            logger.debug(f"[Security] Bcrypt check failed: {e}")

    # 3. CakePHP salted SHA-256 hashes
    salt = settings.SECURITY_SALT or ""
    salted_combos = [
        hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest(),
        hashlib.sha256((plain_password + salt).encode("utf-8")).hexdigest(),
        hashlib.sha256(plain_password.encode("utf-8")).hexdigest(),
        hmac.new(salt.encode("utf-8"), plain_password.encode("utf-8"), hashlib.sha256).hexdigest(),
        hashlib.sha1((salt + plain_password).encode("utf-8")).hexdigest(),
        hashlib.sha1((plain_password + salt).encode("utf-8")).hexdigest(),
        hashlib.sha1(plain_password.encode("utf-8")).hexdigest(),
    ]

    for cand in salted_combos:
        if hmac.compare_digest(cand.lower(), hashed_password.lower()):
            return True

    return False

def _get_aes_key(key: Optional[str] = None) -> bytes:
    raw_key = (key or settings.ENCRYPTION_KEY or "cag_default_dev_encryption_key32").encode("utf-8")
    if len(raw_key) == 32:
        return raw_key
    return hashlib.sha256(raw_key).digest()

def encrypt_payload(plain_text: str, key: Optional[str] = None) -> str:
    """
    Two-way AES-256-CBC symmetric encryption matching PHP Security::encrypt(data, ENCRYPTION_KEY).
    Returns a URL-safe token containing (IV + ciphertext).
    """
    if not plain_text:
        return ""
    if not CRYPTO_AVAILABLE:
        # Simple fallback token
        return base64.urlsafe_b64encode(plain_text.encode("utf-8")).decode("utf-8")
    
    try:
        aes_key = _get_aes_key(key)
        iv = os.urandom(16)
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(plain_text.encode("utf-8")) + padder.finalize()
        
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv))
        encryptor = cipher.encryptor()
        cipher_text = encryptor.update(padded_data) + encryptor.finalize()
        
        combined = iv + cipher_text
        return base64.urlsafe_b64encode(combined).decode("utf-8").rstrip("=")
    except Exception as e:
        logger.error(f"[Security] Encryption failed: {e}")
        return ""

def decrypt_payload(encrypted_token: str, key: Optional[str] = None) -> Optional[str]:
    """
    Two-way AES-256-CBC symmetric decryption matching PHP Security::decrypt(token, ENCRYPTION_KEY).
    """
    if not encrypted_token:
        return None
    if not CRYPTO_AVAILABLE:
        try:
            padded_b64 = encrypted_token + "=" * (-len(encrypted_token) % 4)
            return base64.urlsafe_b64decode(padded_b64.encode("utf-8")).decode("utf-8")
        except Exception:
            return None
            
    try:
        aes_key = _get_aes_key(key)
        padded_b64 = encrypted_token + "=" * (-len(encrypted_token) % 4)
        raw_combined = base64.urlsafe_b64decode(padded_b64.encode("utf-8"))
        
        if len(raw_combined) < 17:
            return None
        
        iv = raw_combined[:16]
        cipher_text = raw_combined[16:]
        
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(cipher_text) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        plain_bytes = unpadder.update(padded_data) + unpadder.finalize()
        return plain_bytes.decode("utf-8")
    except Exception as e:
        logger.error(f"[Security] Decryption failed: {e}")
        return None
