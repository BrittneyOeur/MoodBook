import jwt from 'jsonwebtoken';
import axios from 'axios';

// Function to fetch the signing key from the JWKS endpoint
const getSigningKey = async (kid) => {
    try {
        const jwksUri = process.env.COGNITO_TOKEN;
        const response = await axios.get(jwksUri);
        const keys = response.data.keys;

        // Find the key with the matching kid
        const signingKey = keys.find(key => key.kid === kid);

        if (!signingKey) {
            throw new Error('Key not found');
        }

        // Convert the JWK to PEM format and return
        const publicKey = jwkToPem(signingKey);
        return publicKey;
    } catch (error) {
        console.error("Error fetching JWKS:", error);
        throw new Error("Could not get signing key");
    }
};

// Function to verify the JWT token
export const verifyToken = async (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Authorization header missing or invalid:", authHeader);
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        // Decode the token header to get the `kid`
        const decodedHeader = jwt.decode(token, { complete: true }).header;
        const { kid } = decodedHeader;

        if (!kid) {
            throw new Error('Token does not have a valid `kid`');
        }

        // Get the signing key from the JWKS endpoint
        const publicKey = await getSigningKey(kid);

        // Verify the token using the public key
        const decoded = jwt.verify(token, publicKey);
        return decoded;  // Return the decoded token payload
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
};

// Utility function to convert JWK to PEM format (use jwk-to-pem for conversion)
const jwkToPem = (jwk) => {
    const jwkToPem = require('jwk-to-pem');
    return jwkToPem(jwk);
};