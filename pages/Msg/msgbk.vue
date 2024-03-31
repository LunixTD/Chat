<template>
	<view class="container">
		<StatusBarBox></StatusBarBox>
		<view class="titleBoxPlace"></view>
		<view class="titleBox" :style="titleBoxStyle" :class="isSearching ? 'searching' : ''">
			<text>消息</text>
			<view class="titleRightBox">
				<view class="friendme friend">
					<i class="iconfont icon-ask"></i>
					<text>1</text>
				</view>
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
		<z-paging ref="paging" v-model="dataList" @query="getNotifications"></z-paging>
		<scroll-view scroll-y="true" class="msgContent" :style="msgContentStyle" :class="isSearching ? 'hide' : ''" @scroll="onMsglistScroll">
			<view class="searchBoxPlaced"></view>
			<!-- 近期频繁沟通用户 -->
			<scroll-view scroll-x="true" class="recentFriend" show-scrollbar="false">
				<view class="frindItemBox" v-for="item in recentFriends" :key="item">
					<view class="avatarBox">
						<image :src="'../../static/avatar/' + item + '.jpg'" mode="widthFix" class="avatar"></image>
						<i class="dot"></i>
					</view>
				</view>
			</scroll-view>
			<view class="msg-list">
				<view
					v-for="(item, index) in 100"
					:key="index"
					class="list-item"
					:class="getRippleClass(index)"
					@touchstart="showRipple(index)"
					@touchend="hideRipple(index)"
					@tap="gotoPage('MsgDetail')"
					@longpress="showDetailModal(index)"
				>
					<view class="ripple"></view>
					<view class="avatarBox">
						<image :src="'../../static/avatar/' + ((item % 5) + 1) + '.jpg'" mode="widthFix" class="avatar"></image>
						<i class="dot"></i>
					</view>
					<view class="msg-about">
						<view class="upBox">
							<text class="text uname">Robot</text>
							<text class="text dateTime">1年前</text>
						</view>
						<view class="downBox">
							<text class="msg">消息信息内容内容内容内容内容内容内容内容</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
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
import { ref, reactive, computed, watch } from 'vue';
import { onHide } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { touchFeedback } from '@/utils/tools.js';
import { debounce, throttle } from 'lodash';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import variable from '@/styles/variable.js';

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
const searchType = computed(() => {
	return store.state.ui.searchType;
});
const currTabPage = computed(() => {
	return store.state.ui.currTabPage;
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
		height: `calc(100vh - ${statusBarHeight.value + uni.upx2px(variable.TabbarHeight + safeAreaInsets.value.bottom + 99)}px)`,
		top: `${uni.upx2px(variable.TabbarHeight - 14) + statusBarHeight.value}px`
	};
});

const typeItemWidth = 100;
const searchTypeMarkLeft = computed(() => {
	return searchType.value * typeItemWidth + 'rpx';
});

function searchState(state) {
	isSearching.value = state;
}

const isScrolling = ref(false);
const msgBoxScrollDir = ref(0);
const scrollTimer = ref(null);
function onMsglistScroll(e) {
	clearTimeout(scrollTimer.value);
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

function showDetailModal(index) {
	if (!isScrolling.value) {
		touchFeedback();
	}
	// alert(index);
}

function gotoPage(page) {
	uni.navigateTo({
		url: `/pages/${page}/${page}`
	});
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

		.list-item {
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

				.upBox {
					// height: 50rpx;
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

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
						color: rgba($FontGrey, 0.7);
					}
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
