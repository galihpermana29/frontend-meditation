import api from '../index';
import token from '../getAccessToken';

function login(payload) {
	return api.post('/api/rs/login', payload);
}

function getListPasiens(query = '') {
	return api.get(`/api/rs/list?${query}`, token.getAccessToken('rs'));
}

function getPasienEvents(userId) {
	return api.get(`/api/event/user/${userId}`, token.getAccessToken('rs'));
}

function changeStatus(id, payload) {
	return api.put(
		`/api/event/change-status/${id}`,
		payload,
		token.getAccessToken('rs')
	);
}

function postNotif(payload) {
	return api.post('/api/notif', payload, token.getAccessToken('rs'));
}

function getRsData() {
	return api.get('/api/rs/login', token.getAccessToken('rs'));
}

const rsAPI = {
	login,
	getListPasiens,
	changeStatus,
	postNotif,
	getPasienEvents,
	getRsData,
};

export default rsAPI;
