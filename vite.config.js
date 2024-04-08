import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import fs from 'fs'
import path from 'path'

export default defineConfig({
	plugins: [uni()],
	define: {
		'wss.cert': fs.readFileSync(path.join(__dirname, 'keys/certificate.crt')),
		'wss.key': fs.readFileSync(path.join(__dirname, 'keys/private.key')),
	},
	server: {
		open: true,
		// https: {
		// 	cert: fs.readFileSync(path.join(__dirname, 'keys/certificate.crt')),
		// 	key: fs.readFileSync(path.join(__dirname, 'keys/private.key')),
		// },
		//用来配置跨域
		proxy: {
			// '/api': {
			// 	target: 'https://127.0.0.1:80', //目标服务器地址
			// 	changeOrigin: true,
			// 	secure: false,
			// 	protocolRewrite: 'https',
			// 	rewrite: (path) => path.replace(/^\/api/, '')
			// },
			// '/socket.io': {
			// 	target: 'wss://127.0.0.1:80',
			// 	secure: false,
			// 	protocolRewrite: 'wss',
			// 	// ws: true,
			// 	wss: true,
			// }
			'/api': {
				target: 'http://192.168.1.103:3000', //目标服务器地址
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/socket.io': {
				target: 'ws://192.168.1.103:3000',
				ws: true,
			}
		},
	}
});