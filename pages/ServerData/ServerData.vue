<template>
	<!-- 搜素项列表 -->
	<view class="searchFilter">
		<StatusBarBox></StatusBarBox>
		<MyInput icon="search" :inputStyle="searchInputStyle" placeholder="输入搜索关键字"></MyInput>
		<view class="filterTypeBox">
			<view class="typeItemBox">
				<text class="typeItem" :class="searchType == index ? 'active' : ''" v-for="(item, index) in filterType" :key="index" @click="handleSearchTypeClick(index)">
					{{ item.text }}
				</text>
			</view>
			<view class="currTypeMark" :style="{ left: searchTypeMarkLeft }"></view>
		</view>
		<swiper :autoplay="false" class="swiper" easing-function="easeInCubic" duration="300" :current="searchType" @change="swiperChange">
			<swiper-item>
				<view class="swiper-item">
					<Loader :loadState="loadState" v-if="false"></Loader>
					<scroll-view scroll-y="true" class="listItemBox" v-if="serverUserList.length != 0">
						<GroupItemBox :list="creator" title="创建人" :onItemClick="onItemClick"></GroupItemBox>
						<GroupItemBox :list="serverUserList" title="所有成员" :onItemClick="onItemClick"></GroupItemBox>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
	</view>
	<ModalBottom ref="modalRef"></ModalBottom>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import { touchFeedback } from '@/utils/tools.js';
import api from '@/services/request.js';
import GroupItemBox from './GroupItemBox.vue';
import { throttle } from 'lodash';
const filterType = [
	{
		type: 'member',
		text: '成员'
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
		type: 'media',
		text: '媒体'
	},
	{
		type: 'file',
		text: '文件'
	}
];
const store = useStore();
const searchType = ref(0);
const loadState = ref('void');

const searchInputStyle = {
	width: 'calc(100vw - 60rpx)',
	height: '88rpx',
	borderRadius: '44rpx',
	marginTop: '30rpx'
};

const typeItemWidth = 100;
const searchTypeMarkLeft = computed(() => {
	return searchType.value * typeItemWidth + 'rpx';
});

function handleSearchTypeClick(index) {
	touchFeedback();
	searchType.value = index;
}
function swiperChange(e) {
	searchType.value = e.detail.current;
	touchFeedback();
}

// 成员列表
const serverUserList = computed(() => {
	// console.log(store.state.chat.serverUserList);
	return store.state.chat.serverUserList;
});
const currServer = computed(() => {
	// console.log(store.state.chat.currServer);
	return store.state.chat.currServer;
});
// 创建人
const creator = computed(() => {
	let tmpArr = [];
	serverUserList.value.forEach((item) => {
		if (item._id == currServer.value.creator) {
			tmpArr.push(item);
		}
	});
	return tmpArr;
});
onLoad(() => {
	store.commit('chat/updateServerUserList');
});

const instance = getCurrentInstance();
const modalRef = ref(null);
const onItemClick = throttle((item) => {
	instance.refs.modalRef.openBottomModal('targetArea', item);
}, 1000);
</script>

<style lang="scss">
// 搜索条目列表
.searchFilter {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	transition: transform ease 0.4s;
	z-index: 10;
	background-color: $ThemeDark3Color;
	@include centering;
	flex-direction: column;

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
			padding: 30rpx;
			padding-bottom: 0;
			@include centering;
			.listItemBox {
				width: 100%;
				height: 100%;
				// background-color: red;
				@include centering;
				flex-direction: column;
				justify-content: flex-start;
			}
		}
	}
}
</style>
