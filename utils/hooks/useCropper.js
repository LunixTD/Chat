import {
	ref
} from 'vue'
import {
	blob2base64,
	uploadFile
} from '@/utils/tools.js';
import api from '@/services/request.js';

export function useChooseImage(cb) {
	uni.chooseImage({
		count: 1,
		success(ret) {
			cb(ret.tempFilePaths[0])
		}
	});
}

export function useCopper() {
	// 裁剪封面
	const url = ref('');
	const cropedImg = ref('');
	const cropperState = ref(false);
	const imgInfo = ref(null);
	// 选取图片
	function chooseImage() {
		useChooseImage((tmpPath) => {
			url.value = tmpPath
			cropperState.value = true;
		})
	}
	// 取消裁剪
	function cancelCrop() {
		cropperState.value = false;
		setTimeout(() => {
			url.value = '';
		}, 200);
	}
	// 头像裁剪完毕回调
	function imgCropEnd(ev) {
		cancelCrop();
		cropedImg.value = ev.path;
		// console.log(ev.path);
		blob2base64(cropedImg.value, 'png').then(async (data) => {
			const uploadRes = await api.uploadBase64Img({
				base64: data
			})
			// console.log(uploadRes);
			if (uploadRes.statusCode == 200) {
				imgInfo.value = {
					url: uploadRes.data.url,
					thumb: uploadRes.data.thumb
				};
			}
		});

		// 转base64发送到后台
		// blob2base64(avatar.value, 'png').then((data) => {
		// 	console.log(data);
		// });
	}


	// url: 裁剪组件用到的图片路径
	// avatar: 裁剪出的图片临时路径
	// cropperState: 裁剪组件显示状态
	// imgInfo: 后续提交到服务器需要用到的图片信息
	// cancelCrop: 取消裁剪
	// imgCropEnd: 裁剪完毕
	return {
		url: url,
		cropedImg: cropedImg,
		cropperState: cropperState,
		imgInfo: imgInfo,
		chooseImage,
		cancelCrop,
		imgCropEnd,
	}
}