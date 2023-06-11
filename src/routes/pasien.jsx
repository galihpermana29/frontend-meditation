import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PasienHome from '../pages/pasien/home';
import Navbar from '../components/navbar';
import RiwayatKunjungan from '../pages/riwayat';
import Registrasi from '../pages/pasien/registrasi';
import DetailRegistrasi from '../pages/pasien/registrasi/detail';
import Tiket from '../pages/pasien/tiket';
import DataDiri from '../pages/pasien/data-diri';
import AuthenticatedGuardRoute from '../components/guard-route/authenticated';
import Footer from '../components/footer';

const PasienRoutes = () => {
	return (
		<>
			<Navbar />
			<Routes>
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
