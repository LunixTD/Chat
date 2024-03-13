import api from '@/services/request.js'
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

// 临时地址转base64
export const blob2base64 = (url, type) => {
	return new Promise((resolve, reject) => {
		if (typeof uni.getFileSystemManager == 'function') {
			// #ifdef APP
			plus.io.resolveLocalFileSystemURL(url, (entry) => {
				var reader = null
				entry.file((file) => {
					reader = new plus.io.FileReader()
					reader.readAsDataURL(file)
					reader.onloadend = (e) => {
						resolve(e.target.result)
					}
					reader.onerror = (err) => {
						reject(err);
					}
				})
			})
			// #endif
			// #ifdef MP-WEIXIN
			wx.getFileSystemManager().readFile({
				filePath: url, //选择图片返回的相对路径
				encoding: "base64", //编码格式
				success: (res) => {
					resolve(
						"data:image/" +
						type.toLocaleLowerCase() +
						";base64," +
						res.data
					);
				},
				fail: (res) => reject(res.errMsg),
			});
			// #endif

		} else {
			uni.request({
				url: url,
				method: "GET",
				responseType: "arraybuffer",
				success: (res) => {
					let base64 = wx.arrayBufferToBase64(res.data); //把arraybuffer转成base64
					base64 = `data:image/${type};base64,` + base64;
					resolve(base64);
				},
				fail: (res) => reject(res.errMsg),
			});
		}
	})
}

export const uploadFile = (type, url) => {
	let requestUri = type == 'img' ? api.upload_img : ''
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: api.upload_img,
			filePath: url,
			name: 'file',
			fail: (err) => {
				reject(err.errMsg);
			},
			success: (res) => {
				resolve(res);
			}
		});
	})
}

export const formatTime = (dat) => {
	let date = new Date()
	let year = date.getFullYear()
	let month = getNum(date.getMonth() + 1)
	let day = getNum(date.getDate())
	let hour = getNum(date.getHours())
	let minute = getNum(date.getMinutes())
	let ret = `${year}/${month}/${day} ${hour}:${minute}`

	function getNum(num) {
		return num > 9 ? num : '0' + num
	}
	return ret
}

// export default touchFeedback