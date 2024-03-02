<template>
	<view class="userinfoBox">
		<view class="info-avatarBox">
			<image class="info-avatar" src="../../static/avatar/1.jpg" mode="widthFix"></image>
		</view>
		<text class="info-nickname">Tudou</text>
		<text class="info-about">您和Tudou的传奇对话从这里开始。</text>
	</view>
</template>

<script setup></script>

<style lang="scss">
.userinfoBox {
	width: 100%;
	height: 36vh;
	// background-color: lightblue;
	// padding: 0 16rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-start;
	padding: 0 20rpx;

	.info-avatarBox {
		width: 100%;
		// height: 200rpx;
		padding: 20rpx 0;
		padding-top: 180rpx;
		// background-color: red;

		.info-avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
		}
	}

	.info-nickname {
		display: block;
		color: $FontWhite;
		font-size: 56rpx;
	}
	.info-about {
		display: block;
		color: $FontGrey;
		font-size: 28rpx;
		margin-top: 10rpx;
	}
}
</style>
