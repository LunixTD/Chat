<template>
	<view class="voicePageContainer">
		<!-- <Header></Header> -->
		<view class="voiceBg" :style="voiceBgStyle">
			<view class="mask"></view>
		</view>

		<!-- <view class="imgWrapper">
			<image style="voiceAvatarBg" src="../../static/avatar/placed.jpeg" mode="heightFix"></image>
		</view> -->
		<view class="content">
			<view class="globalVoiceCounter">0:00</view>

			<view class="userAvatar" v-if="roomData">
				<!-- <image :src="api.target_url + roomData.target.avatarInfo.thumb" mode="widthFix"></image> -->
				<Avatar :customStyle="avatarStyle" :name="roomData.target.nickname" :avatarInfo="roomData.target.avatarInfo"></Avatar>
				<text class="nickname">{{ roomData.target.nickname }}</text>
			</view>
			<text class="alert block" v-if="showInfo">由于未知网络问题已断开连接...</text>

			<view class="funcBtn" :class="type == 'sender' || voiceState ? 'show' : 'hide'">
				<view class="btnBox left" :class="[speakerState ? 'active' : '', voiceState ? 'show' : '']" @click="handleBtn('speaker')">
					<view class="iconBox">
						<i class="iconfont" :class="speakerState ? 'icon-yangshengqi-kaiqi' : 'icon-yangshengqi-guanbi'"></i>
					</view>
					<text>{{ speakerState ? '扬声器已开' : '扬声器已关' }}</text>
				</view>
				<view class="btnBox mid" @click="handleBtn('handup')">
					<view class="iconBox">
						<i class="iconfont icon-guaduan"></i>
					</view>
					<text>挂断</text>
				</view>
				<view class="btnBox right" :class="[microState ? 'active' : '', voiceState ? 'show' : '']" @click="handleBtn('micro')">
					<view class="iconBox">
						<i class="iconfont icon-maikefeng1"></i>
					</view>
					<text>{{ microState ? '麦克风已开' : '麦克风已关' }}</text>
				</view>
			</view>
			<view class="funcBtn" :class="type == 'receiver' && !voiceState ? 'show' : 'hide'">
				<view class="btnBox mid" @click="handleBtn('reject')">
					<view class="iconBox">
						<i class="iconfont icon-jujie"></i>
					</view>
					<text>拒接</text>
				</view>
				<view class="btnBox mid active" @click="handleBtn('voice')">
					<view class="iconBox">
						<i class="iconfont icon-guaduan"></i>
					</view>
					<text>接听</text>
				</view>
			</view>
		</view>

		<view
			:webrtcState="webrtcState"
			:change:webrtcState="webrtc.sendOffer"
			:roomData="roomData"
			:change:roomData="webrtc.getRoomData"
			:role="role"
			:change:role="webrtc.getRole"
			:offer="offer"
			:change:offer="webrtc.sendAnswer"
			:answer="answer"
			:change:answer="webrtc.getAnswer"
			:candidate="candidate"
			:change:candidate="webrtc.addIceCandidate"
			:close="close"
			:change:close="webrtc.closeConnect"
			:osName="osName"
			:change:osName="webrtc.getOsName"
		></view>
	</view>
</template>

<script>
import api from '@/services/request.js';
export default {
	name: 'GlobalVoice',
	data() {
		return {
			type: '',
			target: null,
			roomId: null,
			roomData: null,
			webrtcState: 'pending',
			role: '',
			offer: null,
			answer: null,
			candidate: null,
			speakerState: false,
			voiceState: false,
			microState: true,
			close: null,
			connectState: null,
			api: api,
			showInfo: false,
			osName: null
		};
	},
	onBackPress(e) {
		if (e.from == 'navigateBack') return false;
		return true;
	},
	computed: {
		showVoicePage() {
			return this.$store.state.ui.showVoicePage;
		},
		voiceBgStyle() {
			let img = null;
			if (this.roomData.target.avatarInfo) {
				img = this.api.target_url + this.roomData.target.avatarInfo.thumb;
			} else {
				img = '../../static/bg/addServer-bg2.png';
			}
			return {
				backgroundImage: `url(${img})`
			};
		},
		avatarStyle() {
			return {
				borderRadius: '20rpx',
				marginBottom: '30rpx'
			};
		}
	},
	onLoad(e) {
		const { type, params } = e;
		this.type = type;
		this.roomData = JSON.parse(params);
		if (type == 'sender') {
			this.voiceState = true;
		}
		let that = this;
		uni.getSystemInfo({
			success(res) {
				that.osName = res.osName;
			}
		});

		this.$socket.on('offer', (offer) => {
			console.log('offer');
			this.offer = offer;
		});
		this.$socket.on('answer', (answer) => {
			console.log('answer');
			this.answer = answer;
		});
		this.$socket.on('candidate', (candidate) => {
			console.log('candidate');
			this.candidate = candidate;
		});

		uni.$on('startVoice', (role) => {
			this.role = role;
			this.webrtcState = 'start';
		});
		uni.$on('closeVoicePage', () => {
			this.close = true;
		});
	},
	methods: {
		socketEmit(data) {
			const { eventName, emitData } = data;
			// console.log(eventName);
			this.$socket.emit(eventName, emitData);
		},
		handleBtn(key) {
			switch (key) {
				case 'reject':
					// 拒接
					this.$socket.emit('voice', {
						type: 'answer',
						data: {
							state: 'reject',
							...this.roomData
						}
					});
					uni.navigateBack();
					break;
				case 'voice':
					// 接听
					this.$socket.emit('voice', {
						type: 'answer',
						data: {
							state: 'accept',
							...this.roomData
						}
					});
					// 接听后ui变化
					this.voiceState = true;
					// this.webrtcState = 'start';
					break;
				case 'handup':
					// 挂断
					this.close = true;
					// 给对方发送挂断信息
					let state = '';
					if (this.connectState == null) {
						state = 'cancel';
					} else {
						state = 'complete';
					}
					this.$socket.emit('voice', {
						type: 'handup',
						data: {
							state,
							...this.roomData
						}
					});
					break;
				default:
					this[key + 'State'] = !this[key + 'State'];
			}
		},
		updateConnectState(state) {
			this.connectState = state;
		},
		leaveVoicePage() {
			// 在清理完音轨后
			uni.navigateBack();
		},
		changeShowInfo() {
			this.showInfo = true;
		}
	}
};
</script>
<script module="webrtc" lang="renderjs">
export default {
	data() {
		return {
			peer: null,
			roomData: null,
			role: '',
			audio: null,
			stream: null,
			tmpCandidate: null,
			osName: null
		};
	},
	beforeUnmount() {
		this.closeConnect()
	},
	methods: {
		async getRoomData(data) {
			if (!data) return;
			this.roomData = data;
			await this.initWebRTC();
		},
		getRole(role) {
			if (!role) return;
			this.role = role;
		},
		getOsName(osName) {
			console.log(osName)
			if (!osName) return
			this.osName = osName
		},
		async initMedia() {
			// 音视频通话
			// console.log(navigator.userAgent)
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: true
			}).catch((err) => {
				console.log('抛出错误,需要全局捕获')
				return Promise.reject(err)
			})
			this.stream.getTracks().forEach((track) => {
				this.peer.addTrack(track, this.stream);
			});
		},
		async initWebRTC(rtcState) {
			// const PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection
			// const rtcConfig = {
			// 	iceServers: [
			// 	    {
			// 	      urls: ['stun:stun.l.google.com:19302'],
			// 	    }]
			// }
			this.peer = new RTCPeerConnection();

			// 监听推流
			this.peer.ontrack = (e) => {
				// console.log(e.streams[0])
				this.createAudio(e.streams[0]);
			};
			// 监听连接状态的变化
			this.peer.onconnectionstatechange = (e) => {
				// console.log(this.peer.connectionState)
				this.$ownerInstance.callMethod('changeConnectState', this.peer.connectionState)
				switch(this.peer.connectionState) {
					case 'disconnected':
						this.$ownerInstance.callMethod('changeShowInfo')
						break;
				}
			}

			// this.peer.onnegotiationneeded = (e) => {
			// 	console.log(e)
			// }

			// 监听icecandidate
			this.peer.onicecandidate = (e) => {
				// console.log("这是candidate数据："+e.candidate)
				if (e.candidate && e.candidate!==null) {
					this.$ownerInstance.callMethod('socketEmit', {
						eventName: 'candidate',
						emitData: { targetId: this.roomData.target._id, candidate: e.candidate }
					});
				}
			};

			// if(this.role == 'sender') {
			// 	await this.sendOffer();
			// }
		},
		async sendOffer(rtcState) {
			if (this.roomData == null || rtcState!=='start') return;
			await this.initMedia()
			// 创建offer
			let offer = await this.peer.createOffer();
			// 将offer导入本地描述中
			await this.peer.setLocalDescription(offer);
			// 将本机offer通过信令传递给远端
			this.$ownerInstance.callMethod('socketEmit', {
				eventName: 'offer',
				emitData: { targetId: this.roomData.target._id, offer }
			});
		},
		// 返回媒体协商数据
		async sendAnswer(offer) {
			if (!offer) return;
			await this.initMedia()
			await this.peer.setRemoteDescription(offer);
			this.peer.addIceCandidate(this.tmpCandidate);
			// console.log('---offer'+ new Date().getTime())
			const answer = await this.peer.createAnswer();
			await this.peer.setLocalDescription(answer);
			this.$ownerInstance.callMethod('socketEmit', {
				eventName: 'answer',
				emitData: {
					targetId: this.roomData.target._id,
					answer
				}
			});
		},
		// 将远端发送来的媒体协商数据设置到远端描述中
		async getAnswer(answer) {
			if (!answer) return;
			await this.peer.setRemoteDescription(answer);
			// console.log(this.tmpCandidate)
		},
		// 添加候选源，建立最后的连接
		addIceCandidate(candidate) {
			if (!candidate) return;
			// console.log('---candidate'+ new Date().getTime())
			if (this.role != 'sender') {
				this.tmpCandidate = candidate
			} else {
				this.peer.addIceCandidate(candidate);
			}
		},
		// 创建audio组件,监听语音时长等
		createAudio(stream) {
			this.audio = document.createElement('audio');
			this.audio.setAttribute('autoplay', true);
			this.audio.onloadedmetadata = () => {
				this.audio.play();
			};
			this.audio.ontimeupdate = () => {
				console.log(this.audio.currentTime)
			}
			this.audio.srcObject = stream;
		},
		// 关闭连接并清空音轨和数据流
		closeConnect(close) {
			if (!close)return
			if (close == true) {
				if (this.audio) {
					this.peer.close()
					// this.audio.pause()
					this.audio.srcObject = null;
					this.stream.getTracks().forEach(track => {
						track.stop()
					})
					this.stream = null;
				}
				this.$ownerInstance.callMethod('leaveVoicePage')
			}
		}
	}
};
</script>

<style lang="scss">
.voicePageContainer {
	touch-action: none;
	width: 100vw;
	height: 100vh;
	background-color: $ThemeDark3Color;
}
.voiceBg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	// background-image: url(/static/Index-bg.png);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	filter: blur(38rpx);
	backdrop-filter: blur(38rpx);
	-webkit-backdrop-filter: blur(38rpx);
	z-index: 1;
	.mask {
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: rgba(black, 0.6);
	}
}
.content {
	position: relative;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	@include centering;
	flex-direction: column;
	text-align: center;
}
.globalVoiceCounter {
	position: absolute;
	top: 100rpx;
	width: 100vw;
	color: $FontWhite;
	font-size: 32rpx;
}
.userAvatar {
	width: 200rpx;
	height: 200rpx;
	margin-top: -38%;
	image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
	}
	.nickname {
		font-size: 32rpx;
	}
}
.block {
	font-size: 21rpx;
}
.funcBtn {
	width: 100vw;
	// height:
	position: absolute;
	bottom: 180rpx;
	@include centering;
	justify-content: space-evenly;
	transition: opacity ease 0.2s;
	&.show {
		opacity: 1;
		z-index: 10;
	}
	&.hide {
		opacity: 0;
		z-index: -1;
	}
	.btnBox {
		transition: opacity ease 0.2s, transform ease 0.5s;
		&.active .iconBox {
			background-color: $FontWhite;
			color: rgba(black, 0.8);
		}
		&.mid .iconBox {
			background-color: $IconRed;
			color: $FontWhite;
		}
		&.mid.active .iconBox {
			background-color: $IconGreen;
		}
		&.left {
			transform: translate(100rpx);
			opacity: 0;
		}
		&.left.show {
			transform: translate(0);
			opacity: 1;
		}
		&.right {
			transform: translate(-100rpx);
			opacity: 0;
		}
		&.right.show {
			transform: translate(0);
			opacity: 1;
		}
		.iconBox {
			@include centering;
			flex-direction: column;
			width: 128rpx;
			height: 128rpx;
			border-radius: 64rpx;
			transition: background ease 0.2s;
			// background-color: $FontWhite;
			margin-bottom: 20rpx;

			.iconfont {
				font-size: 68rpx;
			}
		}
		text {
			overflow: hidden;
			margin-top: 20rpx;
			font-size: 26rpx;
		}
	}
}
.imgWrapper {
	position: fixed;
	top: 0;
	left: 50%;
	right: 0;
	bottom: 0;
	transform: translateX(-50%);
	width: 100vw;
	height: 100vh;
	z-index: 1;
	image {
		height: 100vh;
	}
}
</style>
