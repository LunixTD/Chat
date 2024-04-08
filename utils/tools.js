import api from '../services/request.js'
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

export function formatTime(time, format) {
	let date = new Date(time)
	let day = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	const o = {
		'M+': date.getMonth() + 1, // 月份
		'D+': day[date.getDay()],
		'd+': date.getDate(), // 日
		'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
		'H+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
		// a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
		A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
	};
	let hours = date.getHours();

	switch (true) {
		case hours >= 1 && hours < 5:
			o.a = '凌晨'
			break
		case hours >= 5 && hours < 13:
			o.a = '上午'
			break
		case hours >= 13 && hours < 17:
			o.a = '下午'
			break
		case (hours >= 17 && hours < 23) || (hours == 0):
			o.a = '晚上'
			break
	}

	let oneDayTime = 3600 * 1000 * 24
	if (format == 'dynamic') {
		let duration = new Date().getTime() - time
		switch (true) {
			case (duration < oneDayTime):
				format = 'a h:mm'
				break
			case (duration >= oneDayTime && duration < oneDayTime * 2):
				o['D+'] = '昨天'
				format = 'D a h:mm'
				break
			case (duration >= oneDayTime * 2 && duration < oneDayTime * 7):
				format = 'D'
				break
			case (duration >= oneDayTime * 7):
				format = 'MM-dd'
				break
		}
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
			);
		}
	}
	return format;
}

// export default touchFeedback