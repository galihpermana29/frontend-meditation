import axios from 'axios';

const createAPI = (baseURL = import.meta.env.VITE_API_URL, config = {}) => {
	const axiosInstance = axios.create({
		baseURL,
		withCredentials: false,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...config,
	});

	// setup axios.intercept
	return axiosInstance;
};

const api = createAPI();

export default api;
