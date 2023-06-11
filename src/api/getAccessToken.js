/**
 *
 * @returns
 */
function getAccessToken(purpose) {
	const initialHeaders = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	let access_token = localStorage.getItem(`${purpose}_token`);
	if (access_token) {
		return {
			headers: {
				Authorization: `Bearer ${access_token}`,
				...initialHeaders,
			},
		};
	} else {
		return {
			headers: initialHeaders,
		};
	}
}

const getAccessTokens = { getAccessToken };

export default getAccessTokens;
