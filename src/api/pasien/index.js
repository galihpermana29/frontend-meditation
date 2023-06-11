import api from '../index';
import token from '../getAccessToken';

function login(payload) {
	return api.post('/api/login', payload);
}
function signup(payload) {
	return api.post('/api/signup', payload);
}
function editProfile(id, payload) {
	return api.put(`/api/signup/${id}`, payload, token.getAccessToken('pasien'));
}

function getDetailUser() {
	return api.get('/api/login', token.getAccessToken('pasien'));
}

function getAllRS(tokenOpt = 'pasien') {
	return api.get('/api/rs/all-rs', token.getAccessToken(tokenOpt));
}

function getAllEvents(query = '') {
	return api.get(`/api/event?${query}`, token.getAccessToken('pasien'));
}

function createEvent(payload) {
	return api.post('/api/event', payload, token.getAccessToken('pasien'));
}

function getDetailEvent(id, tokenOpt = 'pasien') {
	return api.get(`/api/event/${id}`, token.getAccessToken(tokenOpt));
}

function getAllNotif() {
	return api.get('/api/notif', token.getAccessToken('pasien'));
}

function changeMedicalStatus(id, payload) {
	return api.put(`/api/notif/${id}`, payload, token.getAccessToken('pasien'));
}
const pasienAPI = {
	login,
	signup,
	getDetailUser,
	editProfile,
	getAllRS,
	getAllEvents,
	createEvent,
	getDetailEvent,
	getAllNotif,
	changeMedicalStatus,
};

export default pasienAPI;
