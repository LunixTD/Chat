import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
	plugins: [uni()],
	server: {
		//用来配置跨域
		proxy: {
			'/api': {
				target: 'http://192.168.184.229:3000', //目标服务器地址
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/socket.io': {
				target: 'ws://192.168.184.229:3000',
				ws: true,
			}
		}
	}
});