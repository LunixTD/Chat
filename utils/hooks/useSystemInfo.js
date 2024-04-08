import {
	ref
} from 'vue';
import {
	useStore
} from 'vuex'
export function useSystemInfo(key) {
	const infoVal = ref(0);
	uni.getSystemInfo({
		success: (res) => {
			const {
				[key]: value
			} = res
			infoVal.value = value
			if (key == 'safeAreaInsets' && res.osName == 'android') {
				// #ifdef APP
				infoVal.value.bottom = 18
				// #endif
			}
		}
	});

	return infoVal;
}