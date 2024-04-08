<template>
	<view class="tabBarBox" :class="chatroomState == 'show' ? 'hide' : 'show'" :style="`--safebottom: ${safeAreaInsets.bottom}rpx`">
		<view v-for="(item, index) in tabArr" :key="index" class="tab-item" :class="currTabPage == item.type ? 'active' : ''" @click="handleTabClick(item.type)">
			<view class="iconBox">
				<i :class="item.icon" class="iconfont"></i>
				<view class="badge" :class="item.tab == 'notice' ? 'notice' : ''" v-if="getBadgeNum(item.tab) && getBadgeNum(item.tab) !== 0">
					<text class="h5">{{ getBadgeNum(item.tab) }}</text>
				</view>
			</view>
			<text class="text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import variable from '@/styles/variable.js';

const tabArr = reactive([
	{
		type: 'ChatRoom',
		icon: 'icon-service',
		tab: 'server',
		text: '服务器'
	},
	{
		type: 'Msg',
		icon: 'icon-msg',
		tab: 'msg',
		text: '消息'
	},
	{
		type: 'Notification',
		icon: 'icon-tongzhi',
		tab: 'notice',
		text: '通知'
	},
	{
		type: 'My',
		icon: 'icon-wode',
		tab: 'my',
		text: '我的'
	}
]);
const store = useStore();
const currTabPage = computed(() => {
	return store.state.ui.currTabPage;
});
const chatroomState = computed(() => {
	return store.state.ui.chatroomState;
});
const serverBadgeNum = computed(() => {
	return store.state.ui.serverBadgeNum;
});
const msgBadgeNum = computed(() => {
	return store.state.ui.msgBadgeNum;
});
const noticeBadgeNum = computed(() => {
	return store.state.ui.noticeBadgeNum;
});

function getBadgeNum(tab) {
	let num = null;
	switch (tab) {
		case 'server':
			num = serverBadgeNum.value;
			break;
		case 'msg':
			num = msgBadgeNum.value;
			break;
		case 'notice':
			num = noticeBadgeNum.value;
			break;
	}
	return num;
}

function handleTabClick(type) {
	if (type == 'My') {
		uni.$emit('pagePos');
	}
	store.dispatch('ui/changeTabPage', type);
}

const safeAreaInsets = useSystemInfo('safeAreaInsets');
// const tabBarStyle = computed(() => {
// 	return {
// 		// height: `${variable.TabbarHeight + safeAreaInsets.value.bottom}rpx`,
// 		// paddingBottom: `${safeAreaInsets.value.bottom}rpx`
// 	};
// });
</script>

<style lang="scss">
.tabBarBox {
	$SafeBottom: var(--safebottom);
	width: 100vw;
	height: calc($TabbarHeight + $SafeBottom);
	/* #ifdef MP-WEIXIN */
	height: calc($TabbarHeight + $SafeBottom);
	/* #endif */
	padding-bottom: $SafeBottom;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: $TabbarBgColor;
	box-shadow: 3rpx -3rpx 10rpx $ThemeDark3Color;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	z-index: 999;
	border: none;
	transition: all ease 0.3s;
	&.hide {
		transform: translateY(calc($TabbarHeight + $SafeBottom));
		/* #ifdef MP-WEIXIN */
		transform: translateY(calc($TabbarHeight + $SafeBottom));
		/* #endif */
		/* #ifdef H5 */
		transform: translateY(calc($TabbarHeight + $SafeBottom * 1rpx));
		/* #endif */
		opacity: 1;
	}

	.tab-item {
		position: relative;
		width: 25%;
		height: $TabbarHeight;
		color: $TabbarColor;
		padding: 10rpx 0;
		@include centering;
		flex-direction: column;
		justify-content: space-evenly;
		&.active {
			color: $TabbarSelectedColor;
		}

		.iconBox {
			position: relative;
			width: 50rpx;
			@include centering;
			color: inherit;
			.iconfont {
				color: inherit;
				font-size: 36rpx;
			}
		}
		.text {
			font-size: 24rpx;
			transform: scale(0.86);
		}

		.badge {
			position: absolute;
			top: -11rpx;
			left: 30rpx;
			min-width: 42rpx;
			height: 42rpx;
			padding: 0 10rpx;
			background-color: $IconRed;
			border-radius: 21rpx;
			color: white;
			transform: scale(0.7);
			@include centering;
			.h5 {
				font-size: 24rpx;
			}
			&.notice {
				left: 26rpx;
			}
		}
	}
}
</style>
