<template>
	<view class="bottomBox" :style="{ transform: 'translateY(' + bottomBoxRaiseHeight + 'rpx)' }">
		<view class="mainBox">
			<view class="btnBox" @click="chooseImage"><i class="iconfont icon-add1"></i></view>
			<view class="inputBox">
				<!-- 抖音小程序不支持linechange -->
				<textarea
					ref="msgInput"
					id="msgInput"
					v-model="inputText"
					class="textarea"
					:style="{ height: inputHeight + 'rpx' }"
					maxlength="1000"
					cursor-spacing="52"
					:focus="inputFocus"
					:hold-keyboard="true"
					:confirm-hold="true"
					:fixed="true"
					:adjust-position="false"
					:ignoreCompositionEvent="false"
					@linechange="linechange"
					@focus="onInputFocus"
					@blur="onInputBlur"
					@keyboardheightchange="keyboardHeightChange"
				/>
				<i class="iconfont icon-xiaolian" :style="{ top: iconTop + 'rpx' }" @click="toggleContentBox('emoji')"></i>
			</view>
			<view class="btnBox" :class="msgType == 'text' ? 'textBg' : ''">
				<i class="iconfont icon-yuyin" :class="msgType == 'text' ? 'hide' : 'show'" @click="toggleContentBox('voice')"></i>
				<i class="iconfont icon-fasong" :class="msgType == 'text' ? 'show' : 'hide'" @touchend.prevent="sendMsg('text')"></i>
			</view>
		</view>
		<view class="contentBox" :class="showContentBox ? 'show' : 'hide'" @touchmove.prevent>
			<scroll-view scroll-y="true" class="emojiBox boxItem" :class="contentBoxType === 'emoji' ? 'show' : 'hide'">
				<image @click="chooseEmojiImg(index)" :src="item" mode="widthFix" v-for="(item, index) in emojiArr" :key="index" class="emojiImg"></image>
			</scroll-view>
			<view class="voiceBtnBox boxItem" :class="[voiceState == 'recording' ? 'active' : '', contentBoxType === 'voice' ? 'show' : 'hide']">
				<TouchBox :customStyle="customStyle" :touchStyle="touchStyle" class="touchBox" @touchstart="onVoiceStart" @touchend="onVoiceEnd">
					<i class="iconfont icon-maikefeng1"></i>
				</TouchBox>
				<i class="voiceBtnMask"></i>
			</view>
		</view>
	</view>
</template>

<script>
import { px2upx, touchFeedback } from '@/utils/tools.js';
import variable from '../../styles/variable.js';
import permision from '@/js_sdk/wa-permission/permission.js';
import api from '@/services/request.js';
import { emojiList } from '@/static/map/sourceUri.js';

// #ifdef APP
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
// #endif

export default {
	props: ['text'],
	emits: ['updateText'],
	data() {
		return {
			msgId: 5,
			customStyle: {
				// backgroundColor: variable.ThemeDark3Color
			},
			touchStyle: {
				transform: 'scale(0.93)'
			},
			emojiArr: Object.values(emojiList),
			msgType: 'voice',
			contentBoxHeight: 400,
			contentBoxType: 'voice',
			inputFocus: false,
			keyboardHeight: 0,
			inputText: '',
			innerText: '',
			targetTextarea: null,
			cursorPosOnBlur: 0,
			// 语音路径
			voicePath: '',
			voiceState: 'pendding'
		};
	},
	mounted() {
		// #ifdef APP
		let self = this;
		recorderManager.onStop(function (res) {
			// console.log('recorder stop' + JSON.stringify(res));
			self.sendMsg('voice', {
				type: 'voice',
				voiceData: {
					url: res.tempFilePath
				},
				imgData: {},
				content: ''
			});
			self.voicePath = res.tempFilePath;
		});
		// #endif
	},
	computed: {
		iconTop() {
			const textareaheight = this.$store.state.ui.inputHeight;
			let top = 0;
			// 324为底部输入框最大高度，单位rpx
			if (textareaheight < 324) {
				top = textareaheight / 2 - 18;
			} else {
				top = 162 - 18;
			}
			if (top < 0) {
				top = 0;
			}
			return top;
		},
		showContentBox() {
			return this.$store.state.ui.showContentBox;
		},
		inputHeight() {
			return this.$store.state.ui.inputHeight;
		},
		// 底部输入框抬起高度
		bottomBoxRaiseHeight() {
			let height = this.contentBoxHeight;
			if (this.showContentBox) {
				height = 0;
			}
			if (this.keyboardHeight !== 0) {
				// 假定键盘高度大于contentBox高度;
				height = this.contentBoxHeight - px2upx(this.keyboardHeight);
			}
			return height;
		}
	},
	methods: {
		linechange(e) {
			let inputHeight = e.detail.heightRpx;
			if (e.detail.heightRpx > variable.ChatInputMaxHeight) {
				inputHeight = variable.ChatInputMaxHeight;
			}
			this.$store.dispatch('ui/changeInputHeight', inputHeight);
		},
		// 选择图片发送，并上传
		chooseImage() {
			let self = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				sourceType: ['album'],
				success: function (res) {
					let tempFilePaths = res.tempFilePaths[0];

					// 获取图片信息
					uni.getImageInfo({
						src: tempFilePaths,
						success: (imginfoRes) => {
							// app端口压缩图片再发送
							// #ifndef H5
							uni.compressImage({
								src: tempFilePaths,
								quality: 70,
								success: (cpsRes) => {
									// 待解决，某些图片信息错误，比如竖图获取信息是横图
									self.makelocalImgMsg({ ...imginfoRes, url: cpsRes.tempFilePath });
									// 将本地图片上传服务器
								}
							});
							// #endif

							// 临时信息发送后再将图片上传到服务器，如果上传失败，则在消息上提示
							self.uploadImage(tempFilePaths);
						}
					});
				}
			});
		},
		makelocalImgMsg(imgInfo) {
			const { width, height, type, url } = imgInfo;
			// 构建本地消息
			let msg = {
				type: 'image',
				imgData: {
					url: url,
					size: { width, height, type }
				},
				voiceData: {},
				content: ''
			};
			this.sendMsg('image', msg);
		},
		uploadImage(uri) {
			let self = this;
			uni.uploadFile({
				url: api.baseUrl + api.upload_img,
				filePath: uri,
				name: 'file',
				fail: (res) => {
					// console.log(res);
				},
				success: (uploadFileRes) => {
					let { code, data } = JSON.parse(uploadFileRes.data);
					if (code == 200) {
						let msg = {
							type: 'image',
							imgData: data,
							voiceData: {},
							content: ''
						};
						console.log(1111);
						// h5端必须接收服务器返回的图片临时路径，才能开始展示图片
						// #ifdef H5
						this.sendMsg('image', msg);
						// #endif
					}
				}
			});
		},
		sendMsg(type, msgContent) {
			// console.log('发送');
			// 允许消息推送动画
			if (!this.$store.state.ui.canUsePushAnime) {
				this.$store.dispatch('ui/changeCanUsePushAnime', true);
			}
			// 本地假消息制作
			let msg = {
				type: 'text',
				imgData: {},
				voiceData: {},
				content: this.inputText
			};
			this.msgId += 1;
			const self = this;
			this.$store.dispatch('chat/addMsgToList', {
				id: '0000' + self.msgId,
				uid: '11111',
				user: 'tudou',
				date: new Date().getTime(),
				msg: msgContent ? msgContent : msg
			});
			if (type == 'text') {
				this.inputText = '';
			}
		},
		toggleContentBox(type) {
			if (this.contentBoxType != type && this.showContentBox) {
				this.contentBoxType = type;
			} else {
				this.inputFocus = false;
				this.$store.dispatch('ui/changeShowContentBox', !this.showContentBox);
				this.msgPageRaiseForContentBox(this.showContentBox);
				this.contentBoxType = type;
			}
		},
		onInputFocus(e) {
			// this.keyboardHeight = e.detail.height;
			// // #ifdef APP
			// this.msgPageRaiseForContentBox(true, px2upx(e.detail.height));
			// // #endif
			if (this.showContentBox) {
				this.$store.dispatch('ui/changeShowContentBox', false);
				// #ifndef APP
				this.msgPageRaiseForContentBox(this.showContentBox);
				// #endif
			}
		},
		onInputBlur() {
			// console.dir(this.$refs.msgInput.$el);
			// this.inputText = this.innerText;
			// this.keyboardHeight = 0;
			// this.msgPageRaiseForContentBox(false);
		},
		onInputBlurEffect(pos) {
			this.cursorPosOnBlur = pos;
		},
		chooseEmojiImg(index) {
			// 根据失焦时候的光标位置插入表情
			this.inputText = this.inputText.substring(0, this.cursorPosOnBlur) + `[emoji${index + 1}]` + this.inputText.substring(this.cursorPosOnBlur, this.inputText.length);
			// this.inputText += `[emoji${index + 1}]`;
		},
		msgPageRaiseForContentBox(bool, height) {
			// 固定数值,后续需要换成变量
			let contentHeight = bool ? this.contentBoxHeight : 0;
			this.$store.dispatch('ui/changeMsgPageRaiseHeight', height != undefined ? height : contentHeight);
		},
		keyboardHeightChange(e) {
			this.keyboardHeight = e.detail.height;
			// #ifdef APP
			this.msgPageRaiseForContentBox(true, px2upx(e.detail.height));
			// #endif
		},
		// 语音按键
		onVoiceStart() {
			touchFeedback();
			// #ifdef APP
			recorderManager.start();
			// #endif
			// permision.requestAndroidPermission('record');
			this.voiceState = 'recording';
		},
		onVoiceEnd() {
			console.log('录音结束');
			// #ifdef APP
			recorderManager.stop();
			// #endif
			this.voiceState = 'pendding';
		}
	},
	watch: {
		inputText: {
			handler(val) {
				this.$emit('updateText', val);
				this.innerText = val;
				if (val === '') {
					this.msgType = 'voice';
				} else {
					this.msgType = 'text';
				}
			}
		},
		showContentBox: {
			handler(val) {
				if (val == false) {
					this.msgPageRaiseForContentBox(false);
				}
			}
		}
	}
};
</script>

<script module="keyboard" lang="renderjs">
import {emojiList} from '../../static/map/sourceUri.js';
export default {
	setup() {
		return '';
	},
	methods: {
		cursorLocation() {
			alert(1)
		}
	},
	mounted() {
		// 监听键盘退格事件,删除整块emoji字符串
		document.getElementById('msgInput').addEventListener('keydown', (e)=> {
			if (e.keyCode === 8) {
				const { selectionStart, selectionEnd } = e.target
				// console.log(selectionStart,selectionEnd )
				if (selectionStart == selectionEnd) {
					// 删除]结尾的emoji字符
					let strVal = e.target.value;
					let delEnd = selectionStart - 1
					let delChar = strVal.charAt(delEnd);
					let reg = /(?<=\[)[^\]]*(?=\])/g;
					// let matchArr = strVal.match(reg);
					let matchArr = []
					let matched = null
					while((matched = reg.exec(strVal)) !== null) {
						matchArr.push(matched)
					}

					// 根据]符号删除emojiText,代码可以保留
					// console.log(matchArr)
					// if (delChar == ']') {
					// 	const matchModel = emojiList[matchArr.pop()];
					// 	if (matchModel !== undefined) {
					// 		e.preventDefault()
					// 		let delStart = strVal.lastIndexOf("[", delEnd)
					// 		e.target.setRangeText("", delStart, delEnd+1, "end");
					// 		e.target.setSelectionRange(delStart, delStart);
					// 		// this.$ownerInstance.callMethod('deleteEmojiTextHandler', {
					// 		// 	start: delStart,
					// 		// 	end: delEnd+1
					// 		// });
					// 		e.target.dispatchEvent(new Event('input'))
					// 	}
					// }

					// 从emoji字符中间删除整个字符
					if (matchArr.length != 0) {
						let matchEmojiArr = []
						matchArr.forEach((item) => {
							if (emojiList[item[0]] != undefined) {
								let start = item['index'] - 1;
								let end = start + item[0].length + 1;
								let cursorPos = selectionStart - 1;
								if (cursorPos >= start && cursorPos <= end) {
									// console.log("位置正确")
									e.preventDefault();
									e.target.setRangeText("", start, end+1, "end");
									e.target.setSelectionRange(start, start);
									e.target.dispatchEvent(new Event('input'));
								}
							}
						})
					}
				}
			}
		}, false)

		// 监听失焦事件
		const input = document.querySelectorAll('#msgInput textarea');
		input[0].addEventListener('blur', (e) => {
			// console.dir(e.target);
			this.$ownerInstance.callMethod('onInputBlurEffect', e.target.selectionEnd)
		}, false)
		input[0].addEventListener('selectionchange', (e) => {
			console.log(111)
		})
	}
}
</script>

<style lang="scss">
.bottomBox {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100vw;
	// height: 88rpx;
	height: auto;
	background-color: $ThemeDark3Color;
	// background-color: red;
	border-top: 1px solid rgba(0, 0, 0, 0.03);
	@include centering;
	flex-direction: column;
	z-index: 10;
	transition: transform ease 0.3s;

	.mainBox {
		width: 100vw;
		@include centering;
		justify-content: space-evenly;
		padding: 9rpx 0rpx;

		.btnBox {
			position: relative;
			width: 80rpx;
			height: 80rpx;
			transition: background ease 0.3s;
			&.textBg {
				background-color: $ThemePrimaryColor;
			}

			.iconfont {
				width: 80rpx;
				height: 80rpx;
				line-height: 80rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.inputBox {
			position: relative;
			@include centering;
			.textarea {
				box-sizing: content-box;
				background-color: $ThemeLightColor;
				width: calc(100vw - 64rpx - 140rpx - 114rpx - 12rpx);
				min-height: 46rpx;
				// height: 32rpx;
				max-height: $ChatInputMaxHeight;
				line-height: 46rpx;
				padding-left: 28rpx;
				padding-right: 86rpx;
				padding-top: 17rpx;
				padding-bottom: 15rpx;
				border-radius: 39rpx;
				// text-indent: 28rpx;
				color: $FontWhite;
				font-size: 28rpx;
				// white-space: pre-wrap;
				transition: height ease 0.3s;
				::-webkit-scrollbar {
					width: 6rpx;
				}
				::-webkit-scrollbar-thumb {
					border-radius: 6rpx;
					background-color: $ThemeDark1Color;
				}
			}
			.iconfont {
				width: 70rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				vertical-align: middle;
				font-size: 52rpx;
				position: absolute;
				right: 8rpx;
				top: 8rpx;
				transition: top ease 0.3s;
			}
		}
	}

	.contentBox {
		position: relative;
		width: 100vw;
		height: 400rpx;
		// text-align: center;
		// background-color: lightblue;
		// display: none;
		opacity: 0;
		transition: opacity ease 0.3s;
		opacity: 0;
		.boxItem {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 400rpx;
			padding: 0 10rpx;
			padding-bottom: 10rpx;
			@include centering;
			justify-content: space-evenly;
		}
		.emojiBox {
			.emojiImg {
				width: 10%;
				height: 10%;
			}
			&.hide {
				opacity: 0;
				z-index: 1;
			}
			&.show {
				opacity: 1;
				z-index: 10;
			}
		}

		.voiceBtnBox {
			@include centering;
			.touchBox {
				position: absolute;
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				text-align: center;
				z-index: 1000;
				.iconfont {
					border-radius: 50%;
					line-height: 200rpx;
					margin-top: 3rpx;
					font-size: 120rpx;
				}
			}
			&.active .voiceBtnMask {
				opacity: 1;
				transform: scale(4);
				width: 400rpx;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}
			.voiceBtnMask {
				content: '';
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				background-color: $ThemePrimaryColor;
				// opacity: 0;
				transition: all ease 0.3s, border ease 0.05s;
				z-index: 100;
			}
			&.hide {
				opacity: 0;
				z-index: 1;
			}
			&.show {
				opacity: 1;
				z-index: 10;
			}
		}

		&.hide {
			opacity: 0;
		}
		&.show {
			opacity: 1;
		}
	}
}

// 按钮样式
.btnBox {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: $ThemeDark1Color;
	@include centering;

	& .iconfont {
		transition: all ease 0.3s;
	}

	& .hide {
		opacity: 0;
		z-index: -10;
		// display: none;
	}
	& .show {
		opacity: 1;
		z-index: 10;
		// display: block;
	}
}
</style>