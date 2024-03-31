<template>
	<view class="avatarBox" :style="customStyle">
		<image class="my-avatar" :src="avatarSrc" mode="widthFix" v-if="avatarInfo"></image>
		<view class="iconBox" :style="uStateStyle" v-if="uState">
			<i class="iconfont" :class="'icon-ustate-' + uState"></i>
		</view>
		<view class="avatar-text" v-if="!avatarInfo">
			<text class="text">{{ name.substring(0, 1).toUpperCase() }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import api from '@/services/request.js';

const { customStyle, avatarInfo, name, uState, uStateStyle, onClick } = defineProps(['customStyle', 'avatarInfo', 'name', 'uState', 'uStateStyle', 'onClick']);
const avatarSrc = computed(() => {
	return avatarInfo !== undefined ? api.target_url + avatarInfo.thumb : '/static/avatar/placed.jpeg';
});
</script>

<style lang="scss">
.avatarBox {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	z-index: 20;
	@include centering;
	// overflow: hidden;
	font-size: 50rpx;

	.my-avatar {
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}

	.iconBox {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 30rpx;
		height: 30rpx;
		transform: translate(12%, 12%);
		// line-height: calc(38%);
		text-align: center;
		vertical-align: middle;
		border-radius: inherit;
		background-color: $ThemeDark3Color;
		@include centering;
		.iconfont {
			display: block;
			font-size: inherit;
			&.icon-ustate-stealth {
				color: #7d73e3;
			}
			&.icon-ustate-busy {
				color: rgba(241, 63, 67, 1);
			}
			&.icon-ustate-idle {
				color: rgba(240, 178, 50, 1);
			}
			&.icon-ustate-online {
				color: rgba(35, 164, 89, 1);
			}
		}
	}

	.avatar-text {
		display: block;
		width: 100%;
		height: 100%;
		// border-radius: 50%;
		font-size: inherit;
		// text-align: center;
		border-radius: inherit;
		color: $FontWhite;
		background-color: $ThemeLightColor;
		@include centering;
		.text {
			font-size: inherit;
		}
	}
}
</style>
