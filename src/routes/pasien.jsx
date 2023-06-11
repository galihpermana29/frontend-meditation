import { Route, Routes } from 'react-router-dom';
import PasienHome from '../pages/pasien/home';
import Navbar from '../components/navbar';
import RiwayatKunjungan from '../pages/riwayat';
import Registrasi from '../pages/pasien/registrasi';
import DetailRegistrasi from '../pages/pasien/registrasi/detail';
import Tiket from '../pages/pasien/tiket';
import DataDiri from '../pages/pasien/data-diri';
import AuthenticatedGuardRoute from '../components/guard-route/authenticated';
import Footer from '../components/footer';
import NotauthenticatedGuardRoute from '../components/guard-route/notauthenticated';
import LogIn from '../pages/pasien/login';
import SignUp from '../pages/pasien/signup';

const PasienRoutes = () => {
	const locationRoutes = window.location.pathname.split('/')[2];
	return (
		<>
			{!['login', 'signup'].includes(locationRoutes) && <Navbar />}
			<Routes>
				<Route
					exact
					path="/login"
					element={
						<NotauthenticatedGuardRoute>
							<LogIn />
						</NotauthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/signup"
					element={
						<NotauthenticatedGuardRoute>
							<SignUp />
						</NotauthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/"
					element={
						<AuthenticatedGuardRoute>
							<PasienHome />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/riwayat-kunjungan"
					element={
						<AuthenticatedGuardRoute>
							<RiwayatKunjungan />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/registrasi"
					element={
						<AuthenticatedGuardRoute>
							<Registrasi />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/registrasi/:id"
					element={
						<AuthenticatedGuardRoute>
							<DetailRegistrasi />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/detail/:id"
					element={
						<AuthenticatedGuardRoute>
							<DetailRegistrasi />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/tiket/:id"
					element={
						<AuthenticatedGuardRoute>
							<Tiket />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/data-diri"
					element={
						<AuthenticatedGuardRoute>
							<DataDiri />
						</AuthenticatedGuardRoute>
					}
				/>
			</Routes>
			<Footer />
		</>
	);
};

export default PasienRoutes;
