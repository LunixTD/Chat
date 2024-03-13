import {
	ref,
	computed
} from 'vue'
import {
	useSystemInfo
} from '@/utils/hooks/useSystemInfo.js'

export function useStatusBarHeightStyle(height) {
	const statusBarHeight = useSystemInfo('statusBarHeight')
	const style = computed(() => {
		let tmpHeight = height !== undefined ? uni.upx2px(height) : 0;
		let tmpPaddingTop = height !== undefined ? statusBarHeight.value : 0
		return {
			height: `${tmpHeight + statusBarHeight.value}px`,
			paddingTop: `${tmpPaddingTop}px`
		}
	})
	return style
}