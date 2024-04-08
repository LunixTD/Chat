// #ifdef H5
const base_url = "http://192.168.1.103:5173"
// #endif
// #ifndef H5
const base_url = "http://192.168.1.103:3000"
// #endif
const target_url = "http://192.168.1.103:3000"

// #ifndef H5
const pro_base_url = "https://127.0.0.1:80"
// #endif
const pro_target_url = "https://127.0.0.1:80"

// #ifdef H5
const dev_tag = '/api'
// #endif
// #ifndef H5
const dev_tag = ''
// #endif

const upload_img = base_url + dev_tag + "/chat/upload/image"
const upload_img_base64 = base_url + dev_tag + "/chat/upload/image/base64"
const upload_voice = base_url + dev_tag + "/chat/upload/voice"

// 服务器相关
const server_create = base_url + dev_tag + "/server/add"
const server_list = base_url + dev_tag + "/server/list"
const server_join = base_url + dev_tag + "/server/join"
const server_leave = base_url + dev_tag + "/server/leave"
const server_online = base_url + dev_tag + "/server/online"

// 私聊房间相关
const room_create = base_url + dev_tag + "/room/add"
const room_delete = base_url + dev_tag + "/room/delete"
const room_list = base_url + dev_tag + "/room/list"
const room_info = base_url + dev_tag + "/room/info"

// 消息相关
const msg_create = base_url + dev_tag + "/message/add"
const channel_info = base_url + dev_tag + "/chat/channel/info"
const channel_info_update = base_url + dev_tag + "/chat/channel/info/update"
// 获取消息列表
const msg_list = base_url + dev_tag + '/message/list'
const msg_last = base_url + dev_tag + '/message/last'

// 获取emoji列表
const emoji_list = base_url + dev_tag + '/chat/emoji/list'

const user_register = base_url + dev_tag + "/user/register"
const user_login = base_url + dev_tag + "/user/login"
const user_update = base_url + dev_tag + '/user/update'
const user_check = base_url + dev_tag + '/user/check'
const user_search = base_url + dev_tag + '/user/search'


const notice_add = base_url + dev_tag + '/notice/add'
const notice_delete = base_url + dev_tag + '/notice/delete'
const notice_list = base_url + dev_tag + '/notice/list'
const notice_update = base_url + dev_tag + '/notice/update'

// socket
// #ifdef H5
const socket_base_url = "ws://192.168.1.103:5173"
// #endif
// #ifndef H5
const socket_base_url = "ws://192.168.1.103:3000"
// #endif
// #ifndef H5
const pro_socket_base_url = "wss://127.0.0.1:80"
// #endif
// const channel_socket = socket_base_url + "/chat"
// const direct_socket = socket_base_url + "/chat"

let paramObj = {}
let osName = uni.getSystemInfoSync().osName

const request = (url, data) => {
	let token = uni.getStorageSync('token');
	token = token != undefined ? token : ''

	// #ifdef APP
	if (osName == 'android') {
		paramObj.sslVerify = false;
	}
	// #endif
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "POST",
			data,
			...paramObj,
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

// 用户相关
// 注册
const register = async (data) => {
	const res = await request(user_register, data)
	return res;
}
// 登录
const login = async (data) => {
	const res = await request(user_login, data)
	// console.log(res)
	return res;
}
// 校验用户信息
const checkUser = async (data) => {
	const res = await request(user_check, data)
	return res;
}
// 获取用户信息
const getUser = async (data) => {
	const res = await request(user_update, data)
	return res;
}
// 更新用户数据/不传递参数则获取用户数据
const asyncUserProfile = async (data) => {
	const res = await request(user_update, data)
	return res;
}
// 查找用户
const searchUser = async (data) => {
	const res = await request(user_search, data)
	return res;
}


// 资源相关
// 获取emoji资源列表
const getEmojiList = async () => {
	const res = await request(emoji_list)
	return res;
}


// 服务器相关
// 获取服务器列表
// const getServerList = async (data) => {
// 	const res = await request(server_list, data)
// 	return res
// }
// 创建服务器
const createServer = async (data) => {
	const res = await request(server_create, data)
	return res
}
// 加入服务器
const joinServer = async (data) => {
	const res = await request(server_join, data)
	return res
}
// 离开服务器
const leaveServer = async (data) => {
	const res = await request(server_leave, data)
	return res
}
// 获取服务器在线数据
const getServerOnlineData = async (data) => {
	const res = await request(server_online, data)
	return res
}

// 私聊房间相关
// 创建房间
const createRoom = async (data) => {
	const res = await request(room_create, data)
	return res
}
// 删除房间
const deleteRoom = async (data) => {
	const res = await request(room_delete, data)
	return res
}
// 获取用户所有私聊房间
const getRoomList = async (data) => {
	const res = await request(room_list, data)
	return res
}
// 获取单个房间信息
const getRoom = async (data) => {
	const res = await request(room_info, data)
	return res
}

// 根据id获取频道信息
const getChannelInfo = async (data) => {
	const res = await request(channel_info, data)
	return res
}
// 切换频道更新服务器频道数据（在线人员列表等）
const updateChannelInfo = async (data) => {
	const res = await request(channel_info_update, data)
	return res
}

// 消息相关
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
// 获取频道或者私聊房间最后一条消息
const getLastMsg = async (data) => {
	const res = await request(msg_last, data)
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


// 发送一则通知（邀请通知，好友请求通知等）
const pushNotice = async (data) => {
	const res = await request(notice_add, data)
	return res
}
// 删除一则通知（邀请通知，好友请求通知等）
const deleteNotice = async (data) => {
	const res = await request(notice_delete, data)
	return res
}
// 获取通知列表
const getNoticeList = async (data) => {
	const res = await request(notice_list, data)
	return res
}
// 更新通知
const updateNotice = async (data) => {
	const res = await request(notice_update, data)
	return res
}


export default {
	base_url,
	target_url,
	socket_base_url,
	// channel_socket,
	// direct_socket,
	register,
	login,
	createServer,
	asyncUserProfile,
	searchUser,
	getChannelInfo,
	updateChannelInfo,
	getUser,
	checkUser,
	uploadFile,
	uploadBase64Img,
	getEmojiList,
	getMsgList,
	sendMsg,
	joinServer,
	leaveServer,
	getLastMsg,
	pushNotice,
	deleteNotice,
	getNoticeList,
	updateNotice,
	getServerOnlineData,
	createRoom,
	deleteRoom,
	getRoomList,
	getRoom
}