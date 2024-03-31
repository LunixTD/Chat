<template>
	<view class="initContainer">
		<MyPopup ref="pop"></MyPopup>
		<HeaderPlaced></HeaderPlaced>
		<text class="text">为自己取一个昵称吧~</text>
		<MyInput v-model="nickname" :inputStyle="inputStyle" maxlength="20" :onInput="onInput"></MyInput>
		<text class="alert" :class="showState ? 'show' : 'hide'">{{ altText }}</text>
		<view class="btn" @click="onClick">确认</view>
	</view>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import api from '@/services/request.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';

const pop = ref(null);
const instance = getCurrentInstance();
const inputStyle = {
	width: '70vw',
	height: '100rpx',
	textAlign: 'center',
	fontSize: '36rpx'
};

const altText = ref('该昵称已经被使用!');
const nickname = ref('');
const showState = ref(false);
const nicknameRegex = /^[\u4e00-\u9fa5A-Za-z0-9]{3,13}$/;
async function onClick() {
	if (nickname.value == '') {
		altText.value = '昵称不能为空!';
		showState.value = true;
	}
	if (!nicknameRegex.test(nickname.value)) {
		altText.value = '昵称不合法！(昵称只能由3-13位的中英文数字组成！)';
		showState.value = true;
		return;
	}
	const checkRes = await api.checkUser({
		nickname: nickname.value
	});
	if (checkRes.data.code !== 200) {
		altText.value = '该昵称已经被使用!';
		showState.value = true;
	} else {
		const updateRes = await asyncUserProfile('updateProfile', {
			nickname: nickname.value
		});

		console.log('设置昵称成功');
		instance.refs.pop.showPop(`昵称设置成功！`);

		if (updateRes.statusCode == 200) {
			uni.navigateTo({
				url: '/pages/Main/Main',
				animationType: 'zoom-fade-out',
				animationDuration: 240
			});
		}

		// console.log(updateRes);
	}
}
function onInput() {
	showState.value = false;
}
</script>

<style lang="scss">
.initContainer {
	width: 100vw;
	height: 100vh;
	padding: 0 30rpx;
	@include centering;
	justify-content: flex-start;
	flex-direction: column;
	text-align: center;
	.text {
		display: block;
		font-size: 42rpx;
		margin-top: 140rpx;
		margin-bottom: 50rpx;
	}
	.alert {
		color: orangered;
		font-size: 28rpx;
		margin-top: 14rpx;
		opacity: 0;
		&.show {
			opacity: 1;
		}
		&.hide {
			opacity: 0;
		}
	}
	.btn {
		width: 70vw;
		height: 98rpx;
		line-height: 98rpx;
		background-color: $ThemePrimaryColor;
		margin-top: 22rpx;
		border-radius: 6rpx;
		font-size: 36rpx;
	}
}
</style>
