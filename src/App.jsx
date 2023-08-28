import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import AuthContextProvider from './providers/AuthProviders';
import PasienRoutes from './routes/pasien';
import { useEffect } from 'react';
import RsRoutes from './routes/rs';

import {
	WagmiConfig,
	configureChains,
	createClient,
	goerli,
	mainnet,
	sepolia,
} from 'wagmi';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { infuraProvider } from 'wagmi/providers/infura';
function App() {
	const loc = window.location.pathname;

	const { chains, provider, webSocketProvider } = configureChains(
		[goerli, sepolia],
		[
			infuraProvider({ apiKey: '0a9531093c714db48a24942f2302d3d2' }),
			// publicProvider(),
		]
	);

	const client = createClient({
		provider,
		webSocketProvider,
		autoConnect: true,
		connectors: [new MetaMaskConnector({ chains })],
	});

	useEffect(() => {
		if (loc === '/') window.location.replace('/pasien/login');
	}, []);
	return (
		<BrowserRouter>
			<WagmiConfig client={client}>
				<Routes>
					<Route path="/pasien/*" element={<PasienRoutes />} />
					<Route path="/rs/*" element={<RsRoutes />} />
					<Route
						path="*"
						element={<div> Not Found or You do not have permission.</div>}
					/>
				</Routes>
			</WagmiConfig>
		</BrowserRouter>
	);
}

export default App;
