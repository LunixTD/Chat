const needLogin = [
	'/pages/Main/Main',
	'/pages/ChatRoom/ChatRoom',
	'/pages/AddServer/AddServer',
]
const interceptList = ['navigateTo', 'redirectTo', 'reLaunch']

interceptList.forEach((item) => {
	uni.addInterceptor(item, {
		invoke(e) {
			const token = uni.getStorageSync('token')
			const url = e.url.split('?')[0]
			if (needLogin.includes(url) && token == '') {
				uni.showToast({
					title: '登录已过期，请重新登录！',
				})

				uni.reLaunch({
					url: '/pages/Index/Index',
					animationType: 'zoom-fade-out',
					animationDuration: 240
				})
				return false
			}
			return true
		},
		fail(err) {
			console.log(err)
		}
	})
})