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
			<view v-for="(item, index) in dataList" :key="item._id">
				<ListItem :item="item" :index="index"></ListItem>
			</view>

			<template #loadingMoreNoMore>
				<view></view>
			</template>
			<template #empty>
				<view class="empty">
					<image class="emptyImg" src="../../static/bg/noServer-bg.png" mode="widthFix"></image>
					<text class="h1">暂无任何通知</text>
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
import variable from '@/styles/variable.js';
import { onMounted } from 'vue';
import ListItem from './ListItem.vue';
export default {
	components: {
		ListItem
	},
	data() {
		return {
			dataList: [],
			safeAreaBottom: 0,
			statusBarHeight: 0,
			activeMaskIndex: null,
			activeDelBtnIndex: null
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
		onNotiPageClick() {
			// console.log(43243);
			this.$store.commit('notify/changeActiveIndex', null);
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
		let that = this;
		// 更新某条通知和删除某条通知
		uni.$on('updateNotice', (index, data) => {
			that.dataList.splice(index, 1, data);
		});
		uni.$on('deleteNotice', (index, data) => {
			that.dataList.splice(index, 1);
		});
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

.empty {
	text-align: center;
	color: $FontGrey;
	.emptyImg {
		margin-top: -120rpx;
		width: 30vh;
		display: block;
	}
}
</style>