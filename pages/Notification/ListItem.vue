<template>
	<view class="listItemBox">
		<!-- <view class="ripple"></view> -->
		<view
			class="listItem"
			@click.stop="checkNotice(item, index)"
			:style="transXStyle"
			@touchmove="ontouchmove"
			@touchstart="ontouchstart(index, $event)"
			@touchend="ontouchend"
		>
			<view class="avatarBox">
				<Avatar :style="avatarStyle" :name="item.user.nickname" :avatarInfo="item.user.avatarInfo"></Avatar>
				<!-- <image v-if="item.user.avatarInfo" :src="imgUrl + item.user.avatarInfo.thumb" mode="widthFix" class="avatar"></image>
				<text class="avatar-text" v-if="!item.user.avatarInfo">{{ item.user.nickname.substring(0, 1) }}</text> -->
			</view>
			<view class="msg-about" :class="item.state !== undefined ? 'readed' : ''">
				<view class="upBox">
					<text class="text uname">{{ item.user.nickname }}</text>
					<text class="text dateTime">{{ getTime(item.createTime) }}</text>
				</view>
				<view class="downBox">
					<text class="msg" v-if="item.type == 'invite'">邀请您加入"{{ item.server.serverName }}"</text>
					<text class="msg" v-if="item.type == 'request'">请求加为好友</text>
				</view>
				<view class="additionInfo">
					<text class="type">来源：{{ item.type == 'invite' ? '服务器邀请' : '好友申请' }}</text>
					<text class="state" :class="activeIndex == index && runStateAnim ? 'stateAnim' : ''">{{ getNoticeItemState(item) }}</text>
				</view>
			</view>
		</view>
		<view class="delBtn" :style="delBtnStyle" @click="handleDelete(item, index)"><text>删除</text></view>
		<view class="btnMask" :class="activeIndex != null && showMask ? 'show' : 'hide'" @click="hideBtnMask">
			<view class="btn reject" @click.stop="handleReject(item, index)">
				<text>拒绝</text>
			</view>
			<view class="btn accept" @click.stop="handleAccept(item, index)">
				<text>同意</text>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/services/request.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
import { formatTime } from '@/utils/formatTime.js';
export default {
	props: ['item', 'index'],
	data() {
		return {
			imgUrl: api.target_url,
			startX: 0,
			transX: 0,
			useTransition: false,
			showMask: false,
			runStateAnim: false,
			delBtnState: 'hide'
		};
	},
	computed: {
		avatarStyle() {
			return {
				width: '96rpx',
				height: '96rpx'
				// margin: '2rpx 20rpx'
			};
		},
		transXStyle() {
			const transition = this.useTransition ? { transition: `transform ease .2s` } : null;
			return {
				transform: `translateX(${this.transX}px)`,
				...transition
			};
		},
		delBtnStyle() {
			const transition = this.useTransition ? { transition: `width ease .2s` } : null;
			return { width: -this.transX + 'px', ...transition };
		},
		activeIndex() {
			return this.$store.state.notify.activeIndex;
		}
	},
	methods: {
		getTime(date) {
			// console.log(date);
			return formatTime(date, 'yyyy/MM/dd');
		},
		getNoticeItemState(item) {
			if (!item.state) {
				return '';
			}
			return item.state == 'reject' ? '已拒绝' : '已同意';
		},
		async handleReject(item, index) {
			await api.updateNotice({
				id: item._id,
				state: 'reject'
			});
			this.hideBtnMask();
			// 更新通知列表
			uni.$emit('updateNotice', index, {
				...item,
				state: 'reject'
			});
			// 如果拒绝了,直接返回
			return;
		},
		async handleAccept(item, index) {
			const profile = uni.getStorageSync('profile');
			if (item.type == 'invite') {
				api.updateNotice({
					id: item._id,
					state: 'accept'
				});
				// 更新通知列表
				uni.$emit('updateNotice', index, {
					...item,
					state: 'accept'
				});

				const joinRes = await api.joinServer({
					inviteId: item.server.inviteId,
					// applicantId: profile._id
					uid: profile._id
				});

				if (joinRes.statusCode == 200) {
					this.hideBtnMask();
					// console.log(joinRes);
					const { serverList, activeInfo, activeServer, activeChannel } = joinRes.data;
					await asyncUserProfile('updateLocal', {
						serverList,
						activeInfo,
						activeServer,
						activeChannel
					});
					// 请求聊天服务器页面刷新服务器列表
					uni.$emit('refreshServerList');
					// 跳转到聊天服务器页面
					this.$store.commit('ui/changeTabPage', 'ChatRoom');
				}
			}
			if (item.type == 'request') {
				// 好友请求
			}
		},
		async handleDelete(item, index) {
			const delRes = await api.deleteNotice(item._id);
			if (delRes.statusCode == 200) {
				uni.$emit('deleteNotice', index);
				console.log('删除成功');
			}
		},
		checkNotice(item, index) {
			// 这里顺序不能改动!
			this.$store.commit('notify/changeActiveIndex', index);
			if (item.state) {
				this.runStateAnim = true;

				setTimeout(() => {
					this.runStateAnim = false;
				}, 300);
			} else {
				this.showMask = true;
			}
		},
		hideBtnMask() {
			// console.log(323);
			this.showMask = false;
		},
		ontouchstart(index, e) {
			if (!this.item.state) return;
			this.activeDelBtnIndex = index;
			this.useTransition = false;
			this.startX = e.changedTouches[0].pageX;
		},
		ontouchmove(e) {
			if (!this.item.state) return;
			let dis = e.changedTouches[0].pageX - this.startX;
			if (this.transX <= -138 && dis < 0) {
				this.transX = -138;
				this.useTransition = true;
				return;
			}
			if (this.transX >= 0 && dis > 0) {
				this.useTransition = true;
				this.transX = 0;
				return;
			}
			this.transX = this.transX + dis;
			this.startX = e.changedTouches[0].pageX;
			// if ()
		},
		ontouchend(e) {
			if (!this.item.state) return;
			// let rate = 0.3 / 138;
			if (this.delBtnState == 'hide') {
				if (this.transX <= -50) {
					this.transX = -138;
					this.delBtnState = 'show';
				}
				if (this.transX >= 0 || Math.abs(this.transX) < 50) {
					this.transX = 0;
				}
			} else {
				if (this.transX <= -88) {
					this.transX = -138;
				}
				if (this.transX > -88) {
					this.transX = 0;
					this.delBtnState = 'hide';
				}
			}
			this.useTransition = true;
		}
	}
};
</script>

<style lang="scss">
.listItemBox {
	position: relative;
	width: calc(100vw - 40rpx);
	margin-left: 20rpx;
	height: 130rpx;
	// padding: 0 10rpx;
	// background-color: $ThemeDark3Color;
	// margin-bottom: 10rpx;
	color: $FontGrey;
	@include centering;
	border-radius: 30rpx;
	overflow: hidden;
	z-index: 9;

	&:last-child {
		margin-bottom: 10rpx;
	}
}
.listItem {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: $ThemeDark3Color;
	@include centering;
	z-index: 10;
}

.avatarBox {
	width: 126rpx;
	height: 100rpx;
	z-index: 10;
	@include centering;
	// justify-content: flex-start;
}

.msg-about {
	width: calc(100vw - 176rpx);
	height: 100rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-right: 20rpx;
	z-index: 10;
	&.readed .upBox {
		color: $FontGrey;
	}
	&.readed .downBox .msg {
		color: $FontGrey;
	}

	.upBox {
		// height: 50rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: $FontWhite;

		.text {
			vertical-align: middle;
			// line-height: 50rpx;
			font-size: 30rpx;
			font-weight: 600;
		}
		.dateTime {
			color: inherit;
			font-size: 24rpx;
		}
	}
	.downBox {
		width: 100%;
		// height: 40rpx;

		.msg {
			display: inline-block;
			width: 100%;
			vertical-align: middle;
			// line-height: 40rpx;
			font-size: 28rpx;
			font-weight: 200;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: $FontWhite;
		}
	}
	.additionInfo {
		width: 100%;
		font-size: 24rpx;
		color: rgba($FontGrey, 0.7);
		@include centering;
		justify-content: space-between;

		.stateAnim {
			animation: stateAnime ease 0.13s 2 alternate;
			@keyframes stateAnime {
				0% {
					transform: rotate(0deg);
				}
				40% {
					transform: rotate(7deg);
				}
				70% {
					transform: rotate(0deg);
				}
				90% {
					transform: rotate(-7deg);
				}
				100% {
					transform: rotate(0deg);
				}
			}
		}
	}
}

.delBtn {
	position: absolute;
	right: 0;
	top: 0;
	width: 0;
	// width: 138rpx;
	height: 100%;
	background-color: $IconRed;
	@include centering;
	font-size: 30rpx;
	color: white;
	z-index: 1;
	overflow: hidden;
	text {
		white-space: nowrap;
	}
}

.btnMask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.88);
	z-index: -1;
	@include centering;
	color: white;
	font-size: 26rpx;
	transition: all ease 0.28s;
	&.show {
		z-index: 9999;
		opacity: 1;
	}
	&.hide {
		z-index: -1;
		opacity: 0;
	}
	.btn {
		// width: 100rpx;
		// height: 88rpx;
		padding: 20rpx 20rpx;
		border-radius: 40rpx;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
		@include centering;
		margin: 0 40rpx;
	}
	.reject {
		background-color: darkred;
	}
	.accept {
		background-color: $ThemePrimaryColor;
	}
}
</style>
