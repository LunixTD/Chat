<template>
	<view class="bottomBox" :style="{ ...bottomBoxStyle, transform: 'translateY(' + bottomBoxRaiseHeight + 'rpx)' }">
		<view class="mainBox">
			<view class="btnBox" @click="chooseImage"><i class="iconfont icon-add1"></i></view>
			<view class="inputBox">
				<!-- 抖音小程序不支持linechange -->
				<textarea
					ref="msgInput"
					v-model="inputText"
					class="textarea msgInput"
					:style="{ height: inputHeight + 'rpx' }"
					maxlength="1000"
					cursor-spacing="52"
					:focus="inputFocus"
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
		<view class="contentBox" :style="contentBoxStyle" :class="showContentBox ? 'show' : 'hide'" @touchmove.prevent>
			<scroll-view scroll-y="true" class="emojiBox boxItem" :class="contentBoxType === 'emoji' ? 'show' : 'hide'">
				<image :src="item" @click="chooseEmojiImg(index)" :webp="true" mode="widthFix" v-for="(item, index) in emojiList" :key="index" class="emojiImg"></image>
			</scroll-view>
			<view class="voiceBtnBox boxItem" :class="[voiceState == 'recording' ? 'active' : '', contentBoxType === 'voice' ? 'show' : 'hide']">
				<view class="touchBox" @touchstart="onVoiceStart" @touchend="onVoiceEnd">
					<TouchBox :touchStartStyle="touchStartStyle" :touchEndStyle="touchEndStyle">
						<i class="iconfont icon-maikefeng1"></i>
					</TouchBox>
				</view>
				<i class="voiceBtnMask"></i>
			</view>
		</view>
	</view>
</template>

<script>
import { px2upx, touchFeedback } from '@/utils/tools.js';
import variable from '../../styles/variable.js';
import permision from '@/js_sdk/wa-permission/permission.js';
import api from '../../services/request.js';
import { blob2base64 } from '@/utils/tools.js';

// #ifdef APP
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
// #endif

// #ifdef MP-WEIXIN
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
// #endif

export default {
	props: ['text', 'origin'],
	emits: ['updateText'],
	data() {
		return {
			msgId: 5,
			touchStartStyle: {
				// backgroundColor: variable.ThemeDark3Color
			},
			touchEndStyle: {
				transform: 'scale(1.93)'
			},
			emojiList: [],
			msgType: 'voice',
			contentBoxHeight: 400,
			contentBoxType: 'voice',
			inputFocus: false,
			keyboardHeight: 0,
			safeAreaBottom: 0,
			inputText: '',
			innerText: '',
			inputInitHeight: 0,
			inputHeight: 0,
			targetTextarea: null,
			cursorPosOnBlur: 0,
			// 语音路径
			voicePath: '',
			voiceState: 'pendding',
			osName: ''
		};
	},
	beforeMount() {
		// const self = this;
		uni.getSystemInfo({
			success: (res) => {
				this.safeAreaBottom = res.safeAreaInsets.bottom;
				this.contentBoxHeight = 400 + res.safeAreaInsets.bottom;
			}
		});
		api.getEmojiList().then((res) => {
			if (res.statusCode == 200) {
				let emojiSrcArr = Object.values(res.data).map((item) => {
					return api.target_url + item;
				});
				this.emojiList = emojiSrcArr;
				this.$store.commit('chat/setEmojiList', res.data);
			}
		});
	},
	mounted() {
		// #ifndef H5
		let self = this;
		recorderManager.onStop(function (res) {
			// console.log('recorder stop' + JSON.stringify(res));
			// #ifdef APP
			const innerAudioContext = uni.createInnerAudioContext();
			// #endif
			// #ifdef MP-WEIXIN
			const innerAudioContext = wx.createInnerAudioContext();
			// #endif
			innerAudioContext.src = res.tempFilePath;
			let duration = 0;
			innerAudioContext.onCanplay(() => {
				innerAudioContext.duration;
				setTimeout(() => {
					// duration = innerAudioContext.duration;
					if (innerAudioContext.duration < 2) {
						// console.log(self.$refs.pop.showPop('sdfsfd'));
						self.$store.state.ui.myPopupRef.showPop('按键时长太短!');
					} else {
						api.uploadFile('voice', res.tempFilePath).then((uploadRes) => {
							// console.log(uploadRes);
							self.sendMsg('voice', uploadRes);
						});
					}
				}, 100);
			});
		});
		// #endif
		uni.getSystemInfo({
			success: (res) => {
				this.osName = res.osName;
			}
		});
	},
	computed: {
		iconTop() {
			const textareaheight = this.inputHeight;
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
		bottomBoxStyle() {
			return {
				bottom: '-400rpx'
			};
		},
		contentBoxStyle() {
			return {
				height: `${400 + this.safeAreaBottom}rpx`,
				paddingBottom: `${this.safeAreaBottom}rpx`
			};
		},
		showContentBox() {
			return this.$store.state.ui.showContentBox;
		},
		// inputHeight() {
		// 	return this.$store.state.ui.inputHeight;
		// },
		// 底部输入框抬起高度 ⭐⭐
		bottomBoxRaiseHeight() {
			let height = 0;
			// #ifdef APP
			// console.log(this.osName);
			if (this.osName == 'android') {
				height = -18;
			}
			// #endif
			if (this.showContentBox) {
				height = -400;
			}
			if (this.keyboardHeight !== 0) {
				// 我们假定键盘高度大于contentBox高度;
				// console.log(23423);
				height = -px2upx(this.keyboardHeight);
			}

			return height;
		}
	},
	methods: {
		linechange(e) {
			const { lineCount, heightRpx } = e.detail;
			this.inputHeight = heightRpx;
			console.log(this.inputHeight);
			if (heightRpx > variable.ChatInputMaxHeight) {
				this.inputHeight = variable.ChatInputMaxHeight;
			}

			let raiseForInputHeight = 0;
			if (lineCount == 1 && this.inputInitHeight == 0) {
				this.inputInitHeight = heightRpx;
			} else {
				raiseForInputHeight = this.inputHeight - this.inputInitHeight;
			}
			this.$store.dispatch('ui/changeRaiseForInputHeight', raiseForInputHeight);
		},
		// 选择图片发送，并上传
		chooseImage() {
			let self = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				sourceType: ['album'],
				success: async function (res) {
					let tempFilePath = res.tempFilePaths[0];
					const uploadRes = await api.uploadFile('image', tempFilePath);
					// console.log(uploadRes);
					self.sendMsg('image', uploadRes);
				}
			});
		},
		async sendMsg(type, msgContentObj) {
			// console.log('发送');
			// 允许消息推送动画
			if (!this.$store.state.ui.canUsePushAnime) {
				this.$store.dispatch('ui/changeCanUsePushAnime', true);
			}
			// 构建消息对象
			const profile = uni.getStorageSync('profile');
			const self = this;
			// 消息出处
			let sendToId = '';
			if (this.origin == 'channel') {
				sendToId = this.$store.state.chat.currChannel._id;
			} else if (this.origin == 'room') {
				sendToId = this.$store.state.chat.currRoom._id;
			}

			// 没有msgContentObj时默认是文字信息，有则按照约定好的格式提交，格式必须对，这样可直接展开运算参数上传
			if (msgContentObj == undefined) {
				msgContentObj = {
					content: this.inputText
				};
			}

			let msgDisplayType = '';
			const { data: lastMsg } = await api.getLastMsg({
				origin: this.origin,
				id: sendToId
			});
			if (lastMsg == null) {
				msgDisplayType = 'newMsg';
			} else {
				if (lastMsg.creator == profile._id) {
					msgDisplayType = 'additionMsg';
				} else {
					msgDisplayType = 'newMsg';
				}
			}

			const msg = {
				creator: profile,
				[this.origin + 'Id']: sendToId,
				type: type,
				msgDisplayType,
				...msgContentObj
			};
			// console.log(msg);
			// dispatch更新消息队列
			// if (this.origin == 'channel') {
			// 	this.$store.dispatch('message/addMsgToChannelMsgList', msg);
			// } else if (this.origin == 'room') {
			// 	this.$store.dispatch('message/addMsgToDirectMsgList', msg);
			// }
			if (this.origin == 'room') {
				const userList = this.$store.state.chat.currRoom.userList;
				// console.log(userList);
				if (profile._id == userList[0]) {
					msg.targetId = userList[1];
				} else {
					msg.targetId = userList[0];
				}
			}

			// 上传消息
			// 精简上传的消息,将创建人详细信息替换成id就行
			const uploadMsg = {
				...msg,
				creator: profile
			};
			uni.$emit(`${this.origin}/sendMsg`, uploadMsg);
			// 这里如果先插入数据, zpaging会对数据做标记, 上传的消息会添加上标记属性, 所以要先上传消息;
			// this.$store.dispatch('message/changeLastMsg', msg);
			this.$store.state.ui.zPagingRef.addChatRecordData(msg);

			// 如果是文字消息则清空输入框
			if (type == 'text') {
				this.inputText = '';
			}
		},
		// 底部emoji,语音等功能区弹出
		toggleContentBox(type) {
			if (this.contentBoxType != type && this.showContentBox) {
				this.contentBoxType = type;
			} else {
				this.$store.dispatch('ui/changeShowContentBox', !this.showContentBox);
				this.msgPageRaiseForContentBox(this.showContentBox ? this.contentBoxHeight : 0);
				this.contentBoxType = type;
			}
		},
		onInputFocus(e) {
			// if (this.showContentBox) {
			// 	this.$store.dispatch('ui/changeShowContentBox', false);

			// }
			// #ifdef H5
			// 这里有个坑, h5手机端需要下降消息界面, 但是h5pc端不需要, 有无虚拟键盘拉起的区别;
			this.msgPageRaiseForContentBox(false);
			// #endif
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
		msgPageRaiseForContentBox(height) {
			// 功能区域固定高度数值,后续需要可换成变量
			// 这里处理键盘弹出,功能盒子弹出时联动页面的高度抬高变化
			this.$store.dispatch('ui/changeMsgPageRaiseHeight', height != false ? height : 0);
		},
		keyboardHeightChange(e) {
			// #ifndef H5
			let oldKeyboardHeight = this.keyboardHeight;
			this.keyboardHeight = e.detail.height;
			if (this.showContentBox && oldKeyboardHeight == 0) {
				this.$store.dispatch('ui/changeShowContentBox', false);
				this.msgPageRaiseForContentBox(px2upx(e.detail.height));
			} else if (this.showContentBox && oldKeyboardHeight != 0) {
				this.msgPageRaiseForContentBox(this.contentBoxHeight);
			} else if (!this.showContentBox) {
				this.msgPageRaiseForContentBox(px2upx(e.detail.height));
			}
			// #endif
		},
		// 语音按键
		onVoiceStart() {
			console.log('录音开始');
			touchFeedback();
			// #ifndef H5
			recorderManager.start({ format: 'mp3' });
			// #endif
			// permision.requestAndroidPermission('record');
			this.voiceState = 'recording';
		},
		onVoiceEnd() {
			console.log('录音结束');
			// #ifndef H5
			this.$nextTick(() => {
				recorderManager.stop();
			});
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
					if (this.keyboardHeight == 0) {
						this.msgPageRaiseForContentBox(false);
					}
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
		document.getElementsByClassName('msgInput')[0].addEventListener('keydown', (e)=> {
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
		const input = document.querySelectorAll('.msgInput textarea');
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
	z-index: 101;
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
				z-index: 100;
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
				z-index: 10;
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
