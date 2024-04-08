<template>
	<view class="container">
		<StatusBarBox></StatusBarBox>
		<view class="titleBoxPlace"></view>
		<view class="titleBox" :style="titleBoxStyle" :class="isSearching ? 'searching' : ''">
			<text>消息</text>
			<view class="titleRightBox">
				<!-- <view class="friendme friend">
					<i class="iconfont icon-ask"></i>
					<text>1</text>
				</view> -->
				<view class="addfriend friend" @click="gotoPage('AddFriendType')">
					<i class="iconfont icon-my"></i>
					<text>添加好友</text>
				</view>
			</view>
		</view>
		<!-- 搜索框 -->
		<view class="searchBox" :style="searchBoxStyle" :class="[isSearching ? 'searching' : '']">
			<i class="iconfont icon-back2 iconhide" @click="searchState(false)"></i>
			<view class="searchInput">
				<i class="iconfont icon-search"></i>
				<input class="input" type="text" value="" placeholder="搜索" @click="searchState(true)" />
			</view>
			<i class="iconfont icon-server-conf iconhide"></i>
		</view>
		<!-- 消息列表 -->
		<z-paging ref="paging" v-model="dataList" @query="getRoomList" class="msgContent" :paging-style="msgContentStyle" :class="isSearching ? 'hide' : ''">
			<view class="msg-list">
				<view
					v-for="(item, index) in dataList"
					:key="item._id"
					class="msg-list-item"
					:class="getRippleClass(index)"
					@touchstart="showRipple(index)"
					@touchend="hideRipple(index)"
					@click="gotoDetail(item)"
					@longpress="onLongPress(index)"
				>
					<view class="ripple"></view>
					<view class="avatarBox">
						<!-- <image :src="api.target_url + item.target.avatarInfo.thumb" mode="widthFix" class="avatar"></image> -->
						<Avatar :style="avatarStyle" :name="item.target.nickname" :avatarInfo="item.target.avatarInfo"></Avatar>
						<i class="dot"></i>
					</view>
					<view class="msg-about">
						<view class="upBox">
							<text class="text uname">{{ item.target.nickname }}</text>
							<text class="text dateTime">{{ item.updateTime }}</text>
						</view>
						<view class="downBox">
							<text class="downBoxMsg" v-if="item.lastMsg">{{ item.lastMsg.content }}</text>
							<view class="counter" v-if="item.unReadNum != 0">
								<text class="num">{{ item.unReadNum }}</text>
							</view>
						</view>
					</view>
					<view class="mask" :class="(activeIndex == index && maskState) == 'show' ? 'show' : 'hide'" @click.stop="changeMaskState('hide')">
						<view class="delBtn" @click.stop="handleDel(item, index)">
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>
			<template #loadingMoreNoMore>
				<view></view>
			</template>
			<template #empty>
				<view class="empty">
					<image class="emptyImg" src="../../static/bg/noServer-bg.png" mode="widthFix"></image>
					<text class="h1">暂无任何消息</text>
				</view>
			</template>
		</z-paging>
		<!-- 搜素项列表 -->
		<view class="searchFilter" :class="isSearching ? '' : 'hide'">
			<view class="filterTypeBox">
				<view class="typeItemBox">
					<text class="typeItem" :class="searchType == index ? 'active' : ''" v-for="(item, index) in filterType" :key="index" @click="handleSearchTypeClick(index)">
						{{ item.text }}
					</text>
				</view>
				<view class="currTypeMark" :style="{ left: searchTypeMarkLeft }"></view>
			</view>
			<swiper :autoplay="false" class="swiper" easing-function="easeInCubic" duration="300" :current="searchType" @change="swiperChange">
				<swiper-item v-for="(item, index) in filterType" :key="index">
					<view class="swiper-item">
						<image src="../../static/bg/search-none.png" mode="widthFix" class="searchNone"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onUpdated, watch, onMounted, getCurrentInstance } from 'vue';
import { onHide } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { touchFeedback } from '@/utils/tools.js';
import { debounce, throttle } from 'lodash';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
import variable from '@/styles/variable.js';
import api from '@/services/request.js';
import { formatTime } from '@/utils/tools.js';
import { useState } from '@/store/hooks/useStore.js';

const isSearching = ref(false);
const recentFriends = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
const filterType = [
	{
		type: 'recent',
		text: '最近'
	},
	{
		type: 'people',
		text: '人物'
	},
	{
		type: 'media',
		text: '媒体'
	},
	{
		type: 'mark',
		text: '标注'
	},
	{
		type: 'link',
		text: '链接'
	},
	{
		type: 'file',
		text: '文件'
	}
];
const store = useStore();

const uiState = useState('ui', ['searchType', 'currTabPage']);
const { searchType, currTabPage } = uiState;

const currRoom = computed(() => {
	return store.state.chat.currRoom;
});

// 顶部根据状态栏定位的位置
const statusBarHeight = useSystemInfo('statusBarHeight');
const safeAreaInsets = useSystemInfo('safeAreaInsets');
const titleBoxStyle = computed(() => {
	return {
		top: `${statusBarHeight.value}px`
	};
});
const searchBoxStyle = computed(() => {
	return {
		top: `${statusBarHeight.value + uni.upx2px(90)}px`
	};
});
const msgContentStyle = computed(() => {
	return {
		height: `calc(100vh - ${statusBarHeight.value + uni.upx2px(194 + variable.TabbarHeight + safeAreaInsets.value.bottom)}px)`,
		top: `${uni.upx2px(194) + statusBarHeight.value}px`
	};
});
const avatarStyle = computed(() => {
	return {
		width: '96rpx',
		height: '96rpx'
	};
});

const typeItemWidth = 100;
const searchTypeMarkLeft = computed(() => {
	return searchType.value * typeItemWidth + 'rpx';
});

function searchState(state) {
	isSearching.value = state;
}

function gotoPage(page) {
	uni.navigateTo({
		url: `/pages/${page}/${page}`,
		animationType: 'pop-in'
	});
}

const isScrolling = ref(false);
const msgBoxScrollDir = ref(0);
const scrollTimer = ref(null);
function onMsglistScroll(e) {
	// clearTimeout(scrollTimer.value);
	isScrolling.value = true;
	scrollTimer.value = setTimeout(() => {
		isScrolling.value = false;
	}, 300);
	// msgBoxScrollDir.value = e.detail.deltaY;
}

function handleSearchTypeClick(index) {
	touchFeedback();
	store.dispatch('ui/changeSearchType', index);
}
function swiperChange(e) {
	store.dispatch('ui/changeSearchType', e.detail.current);
	touchFeedback();
}

// const rippleClass = reactive({
// 	show: '',
// 	hide: ''
// });
onHide(() => {
	Object.assign(rippleClass, {
		show: '',
		hide: ''
	});
});
const rippleClass = ref('');
const rippleAnimeDelay = ref(false);
const rippleAnimeTimer = ref(null);
const rippleHover = ref();
const currRippleIndex = ref();

// 防止切换页面时触发上一次点击元素的hide动画
watch(currTabPage, () => {
	currRippleIndex.value = -1;
});

const getRippleClass = computed(() => {
	return (index) => {
		// if (isScrolling.value) {
		// 	return '';
		// }
		if (currRippleIndex.value == index) {
			if (rippleHover.value == true) {
				return 'show';
			}
			if (rippleHover.value == false) {
				return 'hide';
			}
		}
	};
});

const showRipple = throttle((index) => {
	// if (isScrolling.value) {
	// 	return false;
	// }
	if (maskState.value == 'show') return;
	rippleHover.value = true;
	currRippleIndex.value = index;
	rippleAnimeTimer.value = setTimeout(() => {
		rippleAnimeTimer.value = null;
		if (rippleAnimeDelay.value) {
			rippleHover.value = false;
			rippleAnimeDelay.value = false;
		}
	}, 300);
}, 300);
const hideRipple = throttle((index) => {
	// if (isScrolling.value) {
	// 	return false;
	// }
	if (rippleAnimeTimer.value == null) {
		currRippleIndex.value = index;
		rippleHover.value = false;
		rippleAnimeDelay.value = false;
	} else {
		rippleAnimeDelay.value = true;
	}
}, 300);

// 长按时的遮罩和相关处理
const maskState = ref('hide');
const activeIndex = ref(null);
function onLongPress(index) {
	activeIndex.value = index;
	if (!isScrolling.value) {
		touchFeedback();
		changeMaskState('show');
	}
	// alert(index);
}
function changeMaskState(state) {
	maskState.value = state;
}
// 删除操作
async function handleDel(item, index) {
	const delRes = await api.deleteRoom({
		roomId: item._id,
		uid: profile._id
	});
	if (delRes.statusCode == 200) {
		console.log('房间删除成功!');
		changeMaskState('hide');
		// console.log(delRes);
		await asyncUserProfile('updateLocal', {
			roomList: delRes.data.roomList
		});
		// console.log(delRes.data.roomList);
		getRoomFromDataList(item._id, 'slice');
	}
}

// 去消息详情页面
function gotoDetail(item) {
	// 离开页面前先清空未读条目
	const roomData = getRoomFromDataList(item._id, 'replace');
	// console.log(roomData);
	roomData.room.unReadNum = 0;
	dataList.value.splice(roomData.index, 1, roomData.room);

	store.commit('chat/changeCurrRoom', item);
	uni.navigateTo({
		url: `/pages/MsgDetail/MsgDetail?room=${JSON.stringify(item)}`
	});
}

const dataList = ref([]);
const paging = ref(null);
const profile = uni.getStorageSync('profile');

// 获取私聊房间列表
async function getRoomList() {
	const resData = await api.getRoomList({ roomList: uni.getStorageSync('profile').roomList });
	// const resData = await api.getRoomList({ uid: profile._id });

	if (resData.statusCode == 200) {
		// console.log(resData);

		// 添加一个新消息未读条目数据
		let dataArr = resData.data.map((item) => {
			return handleRoomData(item);
		});
		// console.log(dataArr);
		paging.value.setLocalPaging(dataArr);
	}
}
// 处理获取到的房间数据
const unReadList = uni.getStorageSync('unReadList');
function handleRoomData(item) {
	// console.log(item);
	// 添加未读条目数
	if (unReadList !== '') {
		item.unReadNum = unReadList[item._id];
	} else {
		item.unReadNum = 0;
	}
	// 添加目标数据
	const userList = item.userList;
	if (userList[0]._id == profile._id) {
		item.target = userList[1];
	} else {
		item.target = userList[0];
	}
	// 添加日期数据
	item.updateTime = formatTime(item.updateTime, 'dynamic');
	return item;
}

// 数据变更位置
// 将socket接收到的消息插入队列
onMounted(() => {
	const instance = getCurrentInstance();
	store.commit('ui/setMsgPagingRef', instance.refs.paging);
	uni.$on('updateRoomList', (room) => {
		// 已经有房间则找出来放最上面,没有则创建
		const roomData = getRoomFromDataList(room._id, 'slice');
		let tmpRoom = null;
		if (roomData.room != undefined) {
			// console.log(roomData);
			tmpRoom = roomData.room;
		} else {
			tmpRoom = handleRoomData(room);
			// console.log(tmpRoom);
		}
		// 将新房间id添加到本地用户信息中
		const roomList = uni.getStorageSync('profile').roomList;
		asyncUserProfile('updateLocal', {
			roomList: [...roomList, tmpRoom._id]
		});

		paging.value.addDataFromTop(tmpRoom);
		// store.commit('chat/changeCurrRoom', tmpRoom);
	});
	// 接收到新消息后,更改显示的最新消息展示和未读数目统计
	uni.$on('updateRoomLastMsg', (msg) => {
		const roomData = getRoomFromDataList(msg.roomId, 'slice');
		roomData.room.lastMsg = msg;
		const pages = getCurrentPages();
		const currPage = pages.slice(-1)[0];
		if (currPage.$page.path != '/pages/MsgDetail/MsgDetail') {
			roomData.room.unReadNum += 1;
		} else {
			if (currRoom.value._id != msg.roomId) {
				roomData.room.unReadNum += 1;
			}
		}
		paging.value.addDataFromTop(roomData.room);
	});
});

// 根据id和操作类型获取到消息列表的某个消息,以便更新和删改操作
function getRoomFromDataList(roomId, actionType) {
	let tmpData = {};
	dataList.value.forEach((item, index) => {
		if (item._id == roomId) {
			tmpData.index = index;
			if (actionType == 'replace') {
				tmpData.room = dataList.value[index];
				return;
			}
			if (actionType == 'slice') {
				tmpData.room = dataList.value.splice(index, 1)[0];
				return;
			}
		}
	});
	return tmpData;
}
</script>

<style lang="scss">
.container {
	position: relative;
	width: 100vw;
	min-height: 100vh;
	// padding: 0 40rpx;
	background-color: $ThemeDark3Color;
	overflow: hidden;
	z-index: 10;
}
.titleBoxPlace {
	width: 100%;
	height: 100rpx;
}
.titleBox {
	position: fixed;
	left: 0;
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
.searchBox {
	position: absolute;
	top: calc(var(--status-bar-height) + 90rpx);
	left: 0;
	width: 100%;
	height: 104rpx;
	padding-bottom: 14rpx;
	padding-top: 10rpx;
	color: $FontWhite;
	background-color: $ThemeDark3Color;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	transition: transform ease 0.4s;
	-webkit-transition: -webkit-transform ease 0.4s;
	z-index: 99;

	.iconfont {
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 40rpx;
	}

	.iconhide {
		position: absolute;
		top: 5rpx;
		width: 80rpx;
		height: 80rpx;
		font-size: 50rpx;
		transition: transform ease 0.4s;
		&:first-child {
			left: 15rpx;
			transform: translateX(-90rpx);
		}
		&:last-child {
			right: 15rpx;
			transform: translateX(90rpx);
			font-size: 50rpx;
		}
	}

	.searchInput {
		width: calc(100% - 80rpx);
		height: 100%;
		background-color: $ThemeDark4Color;
		border-radius: 40rpx;
		padding: 0 26rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		transition: all 0.4s;
		-webkit-transition: all 0.4s;
		transform: translateZ(0);

		.iconfont {
			margin-right: 10rpx;
		}
		.input {
			flex: 1;
			height: 100%;
			vertical-align: middle;
			line-height: 80rpx;
			text-indent: 4rpx;
			font-size: 26rpx;
		}
	}
}
// 和search点击状态相关的页面动画
.searching {
	&.titleBox {
		transform: translateY(-100rpx) scale(1.1);
		opacity: 0;
	}
	&.searchBox {
		transform: translateY(-85rpx);

		.searchInput {
			width: calc(100% - 200rpx);
		}

		.iconhide:first-child {
			transform: translateX(0);
		}
		.iconhide:last-child {
			transform: translateX(0);
		}
	}
}
.msgContent {
	position: absolute;
	left: 0;
	// top: calc($TabbarHeight + var(--status-bar-height) - 14rpx);
	width: 100vw;
	// height: calc(100vh - $TabbarHeight - var(--status-bar-height) - 99rpx);
	transition: transform ease 0.4s, opacity ease 0.4s;
	// background-color: red;

	&.hide {
		transform: translateX(-100%);
		opacity: 0.4;
	}

	.searchBoxPlaced {
		width: 100%;
		height: 100rpx;
	}

	// 热点好友
	.recentFriend {
		white-space: nowrap;
		width: 100vw;
		height: 188rpx;
		padding: 4rpx 40rpx 24rpx 40rpx;

		.frindItemBox {
			position: relative;
			width: 160rpx;
			height: 160rpx;
			border-radius: 30rpx;
			background-color: rgba($FontWhite, 0.05);
			display: inline-block;
			margin-right: 14rpx;
			&:last-child {
				margin-right: 0;
			}

			.avatarBox {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-left: -48rpx;
				margin-top: -48rpx;
				width: 96rpx;
				height: 96rpx;

				.avatar {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
	}
	.msg-list {
		width: 100vw;
		padding: 0 20rpx;
		overflow: hidden;

		.msg-list-item {
			position: relative;
			width: 100%;
			height: 130rpx;
			padding: 0 10rpx;
			// background-color: rosybrown;
			// margin-bottom: 10rpx;
			color: $FontGrey;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
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

			.avatarBox {
				width: 136rpx;
				height: 100rpx;
				z-index: 10;
				@include centering;

				.avatar {
					width: 96rpx;
					height: 96rpx;
					margin: 2rpx 20rpx;
					border-radius: 50%;
				}
			}

			.msg-about {
				width: calc(100vw - 216rpx);
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				z-index: 10;
				color: $FontWhite;

				.upBox {
					// height: 50rpx;
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin: 8rpx 0;

					.text {
						vertical-align: middle;
						// line-height: 50rpx;
						font-size: 30rpx;
						font-weight: 600;
					}
					.dateTime {
						font-size: 24rpx;
						color: rgba($FontGrey, 0.7);
					}
				}
				.downBox {
					width: 100%;
					// height: 40rpx;
					margin: 6rpx 0;
					@include centering;
					justify-content: space-between;

					.downBoxMsg {
						display: inline-block;
						// width: calc(100% - 100rpx);
						vertical-align: middle;
						// line-height: 40rpx;
						font-size: 28rpx;
						font-weight: 200;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: rgba($FontGrey, 0.7);
					}
					.counter {
						// width: 100rpx;
						min-width: 36rpx;
						height: 36rpx;
						margin-left: 8rpx;
						padding: 8rpx 10rpx;
						border-radius: 18rpx;
						background-color: white;
						color: $ThemeDark3Color;
						box-shadow: 3rpx 3rpx 12rpx black;
						@include centering;
						.num {
							font-size: 24rpx;
						}
					}
				}
			}

			.mask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.9);
				@include centering;
				z-index: -1;
				transition: opacity ease 0.18s;
				&.show {
					opacity: 1;
					z-index: 10;
				}
				&.hide {
					opacity: 0;
					z-index: -1;
				}
				.delBtn {
					@include centering;
					font-size: 32rpx;
					padding: 20rpx 30rpx;
					width: 200rpx;
					height: 88rpx;
					letter-spacing: 20rpx;
					text-indent: 20rpx;
					background-color: $IconRed;
					border-radius: 44rpx;
					color: $FontWhite;
				}
			}
		}
	}
}
// 搜索条目列表
.searchFilter {
	position: absolute;
	top: calc(var(--status-bar-height) + 94rpx);
	left: 0;
	width: 100vw;
	height: calc(100vh - var(--status-bar-height) - 100rpx);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	transition: transform ease 0.4s;
	z-index: 10;
	// background-color: rebeccapurple;

	&.hide {
		transform: translateX(100%);
		opacity: 0.4;
	}

	.filterTypeBox {
		position: relative;
		width: 100vw;
		height: 80rpx;
		color: $FontGrey;
		font-size: 26rpx;

		.typeItemBox {
			width: 100%;
			height: 70rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.typeItem {
				width: 100rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;

				&.active {
					color: $ThemePrimary1Color;
				}
			}
		}

		.currTypeMark {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100rpx;
			height: 6rpx;
			background-color: $ThemePrimary1Color;
			border-top-left-radius: 5rpx;
			border-top-right-radius: 5rpx;
			transition: left ease 0.24s;
		}
	}

	.swiper {
		width: 100%;
		height: calc(100% - 80rpx);

		.swiper-item {
			width: 100%;
			height: 100%;
			// background-color: coral;

			.searchNone {
				width: 100%;
			}
		}
	}
}
.empty {
	text-align: center;
	color: $FontGrey;
	.emptyImg {
		margin-top: -120rpx;
		width: 30vh;
		display: block;
	}
}

@keyframes rippleShow {
	0% {
		// transition: all cubic-bezier(0.39, 0.575, 0.565, 1) 0.24s;
		// opacity: 1;
		// transform: scale(12);
	}
	100% {
		opacity: 1;
		transform: scale(12);
	}
}
@keyframes rippleHide {
	0% {
		opacity: 1;
		transform: scale(12);
	}
	100% {
		opacity: 0;
		transform: scale(12);
	}
}
</style>