export function getJwtExpiration(jwt: string) {
	// Split the JWT into its three parts
	const parts = jwt.split('.');
	if (parts.length !== 3) {
		throw new Error('Invalid JWT');
	}

	// Decode the payload part (second part) from Base64Url
	const payload = parts[1];
	const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

	// Parse the decoded payload to a JSON object
	const payloadObj = JSON.parse(decodedPayload);

	// Extract the `exp` claim
	const exp = payloadObj.exp;
	if (!exp) {
		throw new Error('JWT does not contain an exp claim');
	}

	// Convert the Unix timestamp to a human-readable date format
	const expirationDate = new Date(exp * 1000);
	return expirationDate;
}
