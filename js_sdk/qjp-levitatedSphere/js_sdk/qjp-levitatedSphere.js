
/**
 * 
 * 秦江平  -- 2023-12-22
 */

const {
	statusBarHeight
} = uni.getSystemInfoSync();
const systemInfo = uni.getSystemInfoSync();
class LevitatedSphere {
	constructor(options = {}, func, show = true) {
		this.options = options;
		this.func = func
		this.isShow = show
		this.view = null;
		this.bitmap = null;
		this.width = null;
		this.axle = null;
		this.height = null;
		this.clickLoading = false
		this.parameterProcessing(options)
		this.init();
	}
	parameterProcessing(options) {
		const position = this.initPositionHandler(options.initPosition, options)
		this.options.viewStyle = {
			backgroundColor: options.viewStyle?.backgroundColor || 'rgba(0,0,0,0)',
			top: `${options.top ?? position.top}px`,
			left: `${options.left ?? position.left}px`,
			width: `${uni.upx2px(options.viewStyle?.width ?? 100)}px`,
			height: `${uni.upx2px(options.viewStyle?.height ?? 100)}px`,
		}
		this.options.show = options.show
		this.options.moveSpeed = options.moveSpeed ?? 0
		this.options.isMove = options.isMove == false ? false : true
		this.width = this.options.viewStyle.width.replace("px", "")
		this.height = this.options.viewStyle.height.replace("px", "")
		console.log('this.options', this.options);
	}
	init() {
		this.loadPicture().then(() => {
			let webview = null;
			webview = new plus.nativeObj.View(`levitated-sphere`, this.options.viewStyle);
			webview.drawBitmap(
				this.bitmap, {}, {
					width: this.options.viewStyle.width,
					height: this.options.viewStyle.height,
					left: 0,
					top: 0
				},
				"runbackground"
			);
			webview.interceptTouchEvent(true);
			webview.addEventListener("click", (res) => {
				if (this.clickLoading) return
				this.clickLoading = true
				this.func && this.func({
					type: 'click',
					msg: '点击事件',
					data: {},
					options: this.options
				})
			}, false);
			webview.addEventListener("touchstart", (res) => {
				this.clickLoading = false
				this.axle = {
					xAxle: res.pageX,
					yAxle: res.pageY,
					clientX: res.clientX,
					clientY: res.clientY
				}
			}, false);
			webview.addEventListener("touchmove", res => {
				this.clickLoading = false
				const {
					screenX,
					screenY,
					pageX,
					pageY
				} = res;

				if (Math.abs(this.axle.xAxle - pageX) > 10 || Math.abs(this.axle.yAxle - pageY) >
					10) {
					let x = pageX - this.axle.clientX
					let y = pageY - this.axle.clientY
					if (x >= systemInfo.screenWidth - this.width) {
						x = systemInfo.screenWidth - this.width
					}
					if (y >= systemInfo.screenHeight - this.height) {
						y = systemInfo.screenHeight - this.height
					}
					webview.setStyle({
						...this.options.viewStyle,
						top: y,
						left: x,
					})
					this.func && this.func({
						type: 'move',
						msg: '移动事件',
						data: {
							xAxle: x,
							yAxle: y,
							options: this.options,
							systemInfo
						}
					})
					this.clickLoading = true
				}
			}, false);
			webview.addEventListener('touchend', res => {
				if(!this.options.isMove )return
				if(!this.clickLoading)return
				this.keepToTheSideAnimation(res.pageX, systemInfo.screenWidth)
			}, false)
			this.view = webview;
			if (this.isShow) {
				this.view.show();
			}
		});
	}
	keepToTheSideAnimation(x, width) {
		const _that = this
		let index = x
		let timer;
		if (x > width / 2) {
			timer = setInterval(() => {
				index++
				_that.view.setStyle({
					left: index
				})
				if (index >= width - this.width) {
					_that.view.setStyle({
						left: width - this.width
					})
					clearInterval(timer)
				}
			}, _that.moveSpeed)
		} else {
			timer = setInterval(() => {
				index--
				_that.view.setStyle({
					left: index
				})
				if (index <= 0) {
					clearInterval(timer)
				}
			}, _that.moveSpeed)
		}
	}
	loadPicture() {
		this.bitmap = new plus.nativeObj.Bitmap("lp-bg");
		return new Promise((resolve, reject) => {
			this.bitmap.load(
				`_www${this.options.url}`,
				() => {
					resolve();
				},
				error => {
					reject(error);
				}
			);
		});
	}
	initPositionHandler(position, option) {
		let left;
		let top;
		const right = systemInfo.screenWidth - (uni.upx2px(option.viewStyle?.width ?? 500))
		const center = (systemInfo.screenHeight / 2) - (uni.upx2px(option.viewStyle?.height ?? 500) / 2)
		const bottom = systemInfo.screenHeight - uni.upx2px(option.viewStyle?.height ?? 500) - 50
		switch (position) {
			case 'leftTop':
				left = 0;
				top = 50
				break;
			case 'leftCenter':
				left = 0;
				top = center
				break;
			case 'leftBottom':
				left = 0;
				top = bottom
				break;
			case 'rightTop':
				left = right
				top = 50
				break;
			case 'rightCenter':
				left = right;
				top = center
				break;
			case 'rightBottom':
				left = right;
				top = bottom
				break;
			default:
				// 默认值左下
				left = 0;
				top = bottom
				break;
		}

		return {
			top,
			left
		}
	}

	show() {
		this.view.show();
	}
	hide() {
		this.view.hide();
		// this.view.close();
	}
}
function initLevitatedSphere(options, func) {
	return new LevitatedSphere(options, func);
}
export default initLevitatedSphere