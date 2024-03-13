import {
	ref
} from 'vue';
export function useSystemInfo(key) {
	const infoVal = ref(0);
	uni.getSystemInfo({
		success: (res) => {
			const {
				[key]: value
			} = res
			infoVal.value = value
		}
	});
	return infoVal;
}