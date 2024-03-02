<template>
	<view class="tabBarBox" :class="chatroomState == 'show' ? 'hide' : 'show'">
		<view v-for="(item, index) in tabArr" :key="index" class="tab-item" :class="currTabPage == item.type ? 'active' : ''" @click="handleTabClick(item.type)">
			<i :class="item.icon" class="iconfont"></i>
			<text class="text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const tabArr = reactive([
	{
		type: 'ChatRoom',
		icon: 'icon-service',
		text: '服务器'
	},
	{
		type: 'Msg',
		icon: 'icon-msg',
		text: '消息'
	},
	{
		type: 'Notification',
		icon: 'icon-tongzhi',
		text: '通知'
	},
	{
		type: 'My',
		icon: 'icon-wode',
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
function handleTabClick(type) {
	store.dispatch('ui/changeTabPage', type);
}
</script>

<style lang="scss">
.tabBarBox {
	width: 100vw;
	height: $TabbarHeight;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: $TabbarBgColor;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	z-index: 999;
	border: none;
	transition: all ease 0.3s;
	&.hide {
		transform: translateY($TabbarHeight);
		opacity: 0;
	}

	.tab-item {
		width: 25%;
		height: $TabbarHeight;
		color: $TabbarColor;
		padding: 10rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;

		.iconfont {
			font-size: 36rpx;
		}
		.text {
			font-size: 24rpx;
			transform: scale(0.86);
		}

		&.active {
			color: $TabbarSelectedColor;
		}
	}
}
</style>
