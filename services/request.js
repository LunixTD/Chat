// #ifndef MP-WEIXIN
const base_url = "http://192.168.184.229:5173"
// #endif
// #ifdef MP-WEIXIN
const base_url = "http://192.168.184.229:3000"
// #endif
const target_url = "http://192.168.184.229:3000"

// #ifdef MP-WEIXIN
const dev_tag = ''
// #endif
// #ifndef MP-WEIXIN
const dev_tag = '/api'
// #endif

const upload_img = base_url + dev_tag + "/chat/upload/image"
const upload_img_base64 = base_url + dev_tag + "/chat/upload/image/base64"
const upload_voice = base_url + dev_tag + "/chat/upload/voice"
const server_create = base_url + dev_tag + "/chat/server/add"
const server_list = base_url + dev_tag + "/chat/server/list"
const msg_create = base_url + dev_tag + "/message/add"
const channel_info = base_url + dev_tag + "/chat/channel/info"
// 获取消息列表
const msg_list = base_url + dev_tag + '/message/list'

// 获取emoji列表
const emoji_list = base_url + dev_tag + '/chat/emoji/list'

const user_register = base_url + dev_tag + "/user/register"
const user_login = base_url + dev_tag + "/user/login"
const user_update = base_url + dev_tag + '/user/update'
const user_check = base_url + dev_tag + '/user/check'



// socket
const socket_base_url = "ws://192.168.184.229:3000"
const channel_socket = socket_base_url + "/chat/channel"
const direct_socket = socket_base_url + "/chat/direct"

const request = (url, data) => {
	let token = uni.getStorageSync('token');
	token = token != undefined ? token : ''
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "POST",
			data,
			header: {
				authorization: "Bearer " + token
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

const uploadFile = (type, src) => {
	let requestUrl = type === 'image' ? upload_img : upload_voice
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: requestUrl,
			filePath: src,
			name: 'file',
			fail: (res) => {
				reject(res.errMsg)
			},
			success: (uploadFileRes) => {
				let {
					data
				} = uploadFileRes;
				const resData = JSON.parse(data);
				if (resData.code == 200) {
					if (type === 'image') {
						const {
							url,
							thumb,
							width,
							height,
							imgType
						} = resData;
						resolve({
							imgInfo: {
								url,
								thumb,
								width,
								height,
								imgType
							}
						})
					} else {
						const {
							url
						} = resData
						resolve({
							voiceInfo: {
								url
							}
						})
					}
				}
			}
		});
	})
}

// 注册
const register = async (data) => {
	const res = await request(user_register, data)
	return res;
}

// 登录
const login = async (data) => {
	const res = await request(user_login, data)
	console.log(res)
	return res;
}

// 校验用户信息
const checkUser = async (data) => {
	const res = await request(user_check, data)
	return res;
}

// 更新用户数据/不传递参数则获取用户数据
const asyncUserProfile = async (data) => {
	const res = await request(user_update, data)
	return res;
}

// 获取emoji资源列表
const getEmojiList = async () => {
	const res = await request(emoji_list)
	return res;
}

// 获取服务器列表
const getServerList = async (data) => {
	const res = await request(server_list, data)
	return res
}

// 创建服务器
const createServer = async (data) => {
	const res = await request(server_create, data)
	return res
}

// 根据id获取频道信息
const getChannelInfo = async (data) => {
	const res = await request(channel_info, data)
	return res
}

// 获取消息列表，要标注origin消息来源，频道消息或者私信消息
// data: {
// 	origin: 'channel' || 'direct',
// 	id: channelId,
// 	fromId: 此id之前的数据,
// 	num: 拉取条数
// }
const getMsgList = async (data) => {
	const res = await request(msg_list, data)
	return res
}

// 发送消息
const sendMsg = async (data) => {
	const res = await request(msg_create, data)
	return res
}

// 发送图片文件
const uploadImg = async (data) => {
	const res = await request(upload_img, data)
	return res
}
// 发送base64格式图片
const uploadBase64Img = async (data) => {
	const res = await request(upload_img_base64, data)
	return res
}


export default {
	base_url,
	target_url,
	register,
	login,
	getServerList,
	createServer,
	asyncUserProfile,
	getChannelInfo,
	checkUser,
	uploadFile,
	uploadBase64Img,
	getEmojiList,
	getMsgList,
	sendMsg
}