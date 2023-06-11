import * as path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), nodePolyfills()],
	base: './index.html',
	build: {
		input: {
			app: './index.html',
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
});
