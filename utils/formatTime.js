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