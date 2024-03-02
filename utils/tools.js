export const touchFeedback = () => {
	const platform = uni.getSystemInfoSync().platform

	// #ifdef APP-PLUS
	if (platform == 'ios') {
		let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator')
		let impact = new UIImpactFeedbackGenerator();
		impact.prepare()
		impact.init(1)
		impact.impactOccurred();
	}
	if (platform == 'android') {
		let androidPlus = uni.requireNativePlugin("xy-touch-feedback");
		androidPlus.feedback()
	}
	// #endif

	// #ifdef H5
	uni.vibrateShort()
	// uni.vibrateLong({
	// 	success: function() {
	// 		alert(1)
	// 	}
	// })
	// #endif

}

export const px2upx = (px) => {
	let scale = uni.upx2px(100) / 100;
	return px / scale
}

// export default touchFeedback