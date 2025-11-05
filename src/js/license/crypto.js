/**
 * SamaFacture - Utilitaires de Chiffrement
 * Fonctions de chiffrement et déchiffrement pour le système de licence
 */

class CryptoUtils {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.ivLength = 12; // 96 bits pour AES-GCM
    }

    /**
     * Générer une clé de chiffrement à partir d'une phrase de passe
     */
    async generateKey(passphrase) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(passphrase),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('SamaFacture2024'),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: this.algorithm, length: this.keyLength },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Chiffrer des données
     */
    async encrypt(data, passphrase) {
        try {
            const key = await this.generateKey(passphrase);
            const encoder = new TextEncoder();
            const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

            const encrypted = await crypto.subtle.encrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                key,
                encoder.encode(data)
            );

            // Combiner IV et données chiffrées
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);

            // Convertir en base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('Erreur lors du chiffrement:', error);
            throw error;
        }
    }

    /**
     * Déchiffrer des données
     */
    async decrypt(encryptedData, passphrase) {
        try {
            const key = await this.generateKey(passphrase);
            
            // Décoder depuis base64
            const combined = new Uint8Array(
                atob(encryptedData).split('').map(char => char.charCodeAt(0))
            );

            // Séparer IV et données chiffrées
            const iv = combined.slice(0, this.ivLength);
            const encrypted = combined.slice(this.ivLength);

            const decrypted = await crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                key,
                encrypted
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Erreur lors du déchiffrement:', error);
            throw error;
        }
    }

    /**
     * Générer un hash SHA-256
     */
    async hash(data) {
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Générer un identifiant unique basé sur les caractéristiques du navigateur
     */
    async generateMachineId() {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset().toString(),
            navigator.hardwareConcurrency || '0',
            navigator.deviceMemory || '0'
        ];

        const fingerprint = components.join('|');
        return await this.hash(fingerprint);
    }

    /**
     * Générer un nombre aléatoire sécurisé
     */
    generateSecureRandom(length = 16) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Vérifier l'intégrité d'une chaîne avec un checksum
     */
    async verifyChecksum(data, expectedChecksum) {
        const actualChecksum = await this.hash(data);
        return actualChecksum === expectedChecksum;
    }

    /**
     * Créer un checksum pour une chaîne
     */
    async createChecksum(data) {
        return await this.hash(data);
    }

    /**
     * Encoder en Base64 URL-safe
     */
    base64UrlEncode(str) {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    /**
     * Décoder depuis Base64 URL-safe
     */
    base64UrlDecode(str) {
        // Ajouter le padding si nécessaire
        str += '='.repeat((4 - str.length % 4) % 4);
        
        // Remplacer les caractères URL-safe
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        
        return atob(str);
    }

    /**
     * Créer un token JWT simple (sans signature pour usage local)
     */
    createSimpleJWT(payload, expiresIn = 30) {
        const header = {
            alg: 'none',
            typ: 'JWT'
        };

        const now = Math.floor(Date.now() / 1000);
        const exp = now + (expiresIn * 24 * 60 * 60); // expiration en jours

        const fullPayload = {
            ...payload,
            iat: now,
            exp: exp
        };

        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));

        return `${encodedHeader}.${encodedPayload}.`;
    }

    /**
     * Décoder un token JWT simple
     */
    decodeSimpleJWT(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Format JWT invalide');
            }

            const header = JSON.parse(this.base64UrlDecode(parts[0]));
            const payload = JSON.parse(this.base64UrlDecode(parts[1]));

            return { header, payload };
        } catch (error) {
            console.error('Erreur lors du décodage JWT:', error);
            return null;
        }
    }

    /**
     * Vérifier si un token JWT est expiré
     */
    isJWTExpired(token) {
        const decoded = this.decodeSimpleJWT(token);
        if (!decoded || !decoded.payload.exp) {
            return true;
        }

        const now = Math.floor(Date.now() / 1000);
        return now > decoded.payload.exp;
    }

    /**
     * Obtenir les jours restants avant expiration d'un token
     */
    getDaysUntilExpiration(token) {
        const decoded = this.decodeSimpleJWT(token);
        if (!decoded || !decoded.payload.exp) {
            return 0;
        }

        const now = Math.floor(Date.now() / 1000);
        const secondsRemaining = decoded.payload.exp - now;
        
        if (secondsRemaining <= 0) {
            return 0;
        }

        return Math.ceil(secondsRemaining / (24 * 60 * 60));
    }
}

// Instance globale
const cryptoUtils = new CryptoUtils();
