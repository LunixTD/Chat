<template>
	<view class="notiContainer">
		<view class="notiTitleBox" :style="topHeight">
			<text>通知</text>
			<!-- <view class="titleRightBox">
				<view class="friendme friend">
					<i class="iconfont icon-ask"></i>
					<text>1</text>
				</view>
			</view> -->
		</view>
		<z-paging ref="paging" @click="onNotiPageClick" v-model="dataList" @query="getNotifications" class="notiPaging" :paging-style="notiPagingStyle">
			<template #top></template>
			<!-- <HeaderPlaced></HeaderPlaced> -->

			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="list-item" v-for="(item, index) in dataList" :key="item._id">
				<!-- <view class="ripple"></view> -->
				<view class="itemBox" @click.stop="checkNotice(item, index)">
					<view class="avatarBox">
						<Avatar :style="avatarStyle" :name="item.user.avatarInfo" :avatarInfo="item.user.avatarInfo"></Avatar>
						<!-- <image v-if="item.user.avatarInfo" :src="imgUrl + item.user.avatarInfo.thumb" mode="widthFix" class="avatar"></image>
						<text class="avatar-text" v-if="!item.user.avatarInfo">{{ item.user.nickname.substring(0, 1) }}</text> -->
					</view>
					<view class="msg-about" :class="item.state !== undefined ? 'read' : ''">
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
				<view class="btnMask" :class="activeMaskIndex == index ? 'show' : 'hide'" @click="hideBtnMask">
					<view class="btn reject" @click.stop="handleReject(item, index)">
						<text>拒绝</text>
					</view>
					<view class="btn accept" @click.stop="handleAccept(item, index)">
						<text>同意</text>
					</view>
				</view>
			</view>
			<template #loadingMoreNoMore>
				<view></view>
			</template>
			<template #empty>
				<view class="empty">
					<image class="emptyImg" src="../../static/bg/noServer-bg.png" mode="widthFix"></image>
					<text class="h1">这里被打扫的很干净~</text>
				</view>
			</template>
			<template #bottom>
				<view class="bottomBox" :style="lastBoxStyle"></view>
			</template>
		</z-paging>
	</view>
</template>

<script>
import api from '@/services/request.js';
import { formatTime } from '@/utils/tools.js';
import variable from '@/styles/variable.js';
import { onMounted } from 'vue';
import { update } from 'lodash';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
export default {
	data() {
		return {
			dataList: [],
			imgUrl: api.target_url,
			safeAreaBottom: 0,
			statusBarHeight: 0,
			activeIndex: null,
			activeMaskIndex: null,
			runStateAnim: false
		};
	},
	computed: {
		lastBoxStyle() {
			return {
				height: `${variable.TabbarHeight + this.safeAreaBottom}rpx`
			};
		},
		topHeight() {
			return {
				height: `${uni.upx2px(100) + this.statusBarHeight}px`,
				paddingTop: `${this.statusBarHeight}px`
			};
		},
		notiPagingStyle() {
			return {
				top: `${uni.upx2px(100) + this.statusBarHeight}px`
			};
		},
		avatarStyle() {
			return {
				width: '96rpx',
				height: '96rpx',
				margin: '2rpx 20rpx'
			};
		}
	},
	methods: {
		onRefresh() {
			console.log('刷新');
		},
		async getNotifications(pageNo, pageSize) {
			const profile = uni.getStorageSync('profile');
			const findRes = await api.getNoticeList({ uid: profile._id });
			if (findRes.statusCode == 200) {
				// console.log(findRes);
				this.$refs.paging.setLocalPaging(findRes.data.reverse());
			}
		},
		getTime(time) {
			return formatTime(time, 'yyyy/MM/dd');
		},
		getNoticeItemState(item) {
			if (!item.state) {
				return '';
			}
			return item.state == 'reject' ? '已拒绝' : '已同意';
		},
		checkNotice(item, index) {
			// 这里顺序不能改动!
			this.activeIndex = index;
			this.runStateAnim = true;

			setTimeout(() => {
				this.runStateAnim = false;
			}, 300);
			if (item.state) return;
			this.activeMaskIndex = index;
		},
		hideBtnMask() {
			// console.log(323);
			this.activeMaskIndex = -1;
		},
		async handleReject(item, index) {
			await api.updateNotice({
				id: item._id,
				state: 'reject'
			});
			this.hideBtnMask();
			this.dataList.splice(index, 1, {
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
				this.dataList.splice(index, 1, {
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
				//
			}
		},
		onNotiPageClick() {
			// console.log(43243);
			this.hideBtnMask();
		}
	},
	mounted() {
		uni.getSystemInfo({
			success: (res) => {
				this.safeAreaBottom = res.safeAreaInsets.bottom;
				this.statusBarHeight = res.statusBarHeight;
			}
		});
		// 将本页面的paging保存到vuex state中
		this.$store.commit('ui/setNotiPagingRef', this.$refs.paging);
	}
};
</script>

<style lang="scss">
.notiContainer {
	position: relative;
	width: 100vw;
	height: 100vh;
	background-color: $ThemeDark3Color;
}
.titleBoxPlace {
	width: 100%;
	height: 100rpx;
}
.notiTitleBox {
	// position: fixed;
	// left: 0;
	width: 100%;
	height: 90rpx;
	padding: 20rpx 40rpx 10rpx 40rpx;
	// margin: 10rpx 0;
	color: white;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: 40rpx;
	color: $FontWhite;
	background-color: $ThemeDark3Color;
	transition: transform ease 0.4s, opacity ease 0.4s;
	z-index: 999;

	.titleRightBox {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 26rpx;
		/* #ifdef MP-WEIXIN */
		margin-right: 188rpx;
		/* #endif */

		.friendme {
			margin-right: 20rpx;
		}

		.friend {
			height: 70rpx;
			line-height: 70rpx;
			padding: 0 20rpx;
			background-color: rgba($FontWhite, 0.05);
			border-radius: 40rpx;

			.iconfont {
				vertical-align: middle;
				font-size: 34rpx;
				margin-right: 10rpx;
				margin-left: 6rpx;
				display: inline-block;
			}
		}
	}
}
.notiPaging {
	position: absolute;
	left: 0;
	width: 100%;
}
.list-item {
	position: relative;
	width: calc(100vw - 40rpx);
	margin-left: 20rpx;
	height: 130rpx;
	padding: 0 10rpx;
	// background-color: rosybrown;
	// margin-bottom: 10rpx;
	color: $FontGrey;
	@include centering;
	border-radius: 30rpx;
	overflow: hidden;
	z-index: 9;

	&:last-child {
		margin-bottom: 10rpx;
	}

	&::after {
		content: '';
		position: absolute;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		margin-left: -30rpx;
		margin-top: -30rpx;
		background-color: rgba(0, 0, 0, 0.9);
		opacity: 0;
	}
	&.show::after {
		animation: rippleShow ease 0.3s forwards;
	}
	&.hide::after {
		animation: rippleHide ease 0.4s forwards;
	}

	.itemBox {
		@include centering;
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
		&.read .upBox {
			color: $FontGrey;
		}
		&.read .downBox .msg {
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
}
.empty {
	text-align: center;
	color: $FontGrey;
	.emptyImg {
		margin-top: -100rpx;
		width: 40vh;
		display: block;
	}
}
</style>
