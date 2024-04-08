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
		let tmpPaddingTop = statusBarHeight.value
		return {
			height: `${tmpHeight + statusBarHeight.value}px`,
			paddingTop: `${tmpPaddingTop}px`
		}
	})
	return style
}

export function useSafeAreaBottomStyle(height) {
	const safeAreaInsets = useSystemInfo('safeAreaInsets')
	let tmpHeight = height !== undefined ? uni.upx2px(height) : 0;
	const style = computed(() => {
		return {
			paddingBottom: `${safeAreaInsets.value.bottom + tmpHeight}px`
		}
	})
	return style
}