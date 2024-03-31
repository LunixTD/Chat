<template>
	<view class="userConfigContainer">
		<Header></Header>
		<HeaderPlaced></HeaderPlaced>
		<view class="content">
			<view class="confList">
				<ModalListItem title="登出" icon="dengchu" :onClick="logout" color="#f74c30"></ModalListItem>
			</view>
		</view>
	</view>
</template>

<script setup>
function logout() {
	uni.clearStorageSync();
	uni.reLaunch({
		url: '/pages/Index/Index',
		animationType: 'fade-in'
	});
}
</script>

<style lang="scss">
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
}
/* #endif */
.userConfigContainer {
	width: 100vw;
	height: 100vh;
	background-color: $ThemeDark3Color;
}
.content {
	width: 100%;
	padding: 0 30rpx;
	@include centering;
	flex-direction: column;
}
.confList {
	width: 100%;
	@include centering;
	flex-direction: column;
	border-radius: 22rpx;
	border: 1rpx solid $ThemeDarkPop;
	overflow: hidden;
	-webkit-backface-visibility: hidden;
	-webkit-transform: translate3d(0, 0, 0);
}
</style>
