<template>
	<view class="groupItemBox" :style="groupItemBoxStyle">
		<text class="groupTitle">{{ title }}</text>
		<view class="listItemBox">
			<TouchBox renderType="listItem" v-for="(item, index) in list" :key="index">
				<view class="listItem" @click="onItemClick(item)">
					<view class="avatarBox">
						<Avatar :customStyle="memberAvatarStyle" :uStateStyle="memberStateStyle" :name="item.nickname" :avatarInfo="item.avatarInfo" uState="online"></Avatar>
					</view>
					<view class="itemTitleBox">
						<text class="title">{{ item.nickname }}</text>
						<text class="subTitle" v-if="subTitle">{{ subTitle }}</text>
					</view>
					<i class="divider" v-if="index !== list.length - 1">
						<i class="content"></i>
					</i>
				</view>
			</TouchBox>
		</view>
	</view>
</template>

<script setup>
import { defineProps, ref, computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useSafeAreaBottomStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';

const { list, title, subTitle, onItemClick } = defineProps(['list', 'title', 'subTitle', 'onItemClick']);
const memberAvatarStyle = {
	width: '72rpx',
	height: '72rpx',
	fontSize: '28rpx'
};
const memberStateStyle = {
	width: '26rpx',
	height: '26rpx',
	fontSize: '18rpx'
};
const groupItemBoxStyle = useSafeAreaBottomStyle();
</script>

<style lang="scss">
.groupItemBox {
	width: 100%;
	@include centering;
	flex-direction: column;
	align-items: flex-start;
	.groupTitle {
		font-size: 26rpx;
		margin: 8rpx 0 16rpx 10rpx;
	}
}
.listItemBox {
	width: 100%;
	border-radius: 16rpx;
	overflow: hidden;
}
.listItem {
	position: relative;
	width: 100%;
	height: 120rpx;
	flex: 1;
	// background-color: $ThemeDarkPop;
	// border: 1rpx solid $ThemeDarkPop;
	@include centering;
	justify-content: space-between;
	padding-right: 20rpx;
	&.hover {
		background-color: rgba($ThemeDark4Color, 0.1);
	}
	// 头像
	.avatarBox {
		width: 110rpx;
		height: 100rpx;
		@include centering;
		// justify-content: flex-start;

		.avatar {
			width: 66rpx;
			height: 66rpx;
			margin: 2rpx 20rpx;
			border-radius: 50%;
		}
	}

	.itemTitleBox {
		flex: 1;
		@include centering;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		.title {
			font-size: 30rpx;
			margin: 2rpx 0;
		}
		.subTitle {
			font-size: 24rpx;
			color: $FontGrey;
			margin: 2rpx 0;
		}
	}

	.switchBox {
		@include centering;
		// justify-content: flex-end;
		align-items: flex-end;
		// width: 100rpx;
		// transform: scale(1.37);
		// padding-right: 8rpx;
	}

	// 分隔线
	.divider {
		display: block;
		position: absolute;
		bottom: -0.5rpx;
		right: 0;
		width: calc(100% - 106rpx);
		height: 1rpx;
		// padding-left: 16rpx;
		.content {
			display: block;
			width: 100%;
			height: 100%;
			background-color: rgba($FontGrey, 0.12);
		}
	}
}
</style>
