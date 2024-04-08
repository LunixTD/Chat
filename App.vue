<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		// console.log('App Show');
	},
	onHide: function () {
		// console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url('static/fonts/iconfont.css');
@import url('static/fonts/alibabajiankangti.css');
// @import url('static/fonts/alimama.css');
scroll-view ::-webkit-scrollbar {
	display: none !important;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}
page {
	width: 100vw;
	// height: calc(100vh - (44px + env(safe-area-inset-top)));
	height: 100%;
	background-color: $ThemeColor;
	overscroll-behavior: none;
}

/* #ifdef H5 */
uni-page[data-page='pages/Login/Login'],
uni-page[data-page='pages/Register/Register'],
uni-page[data-page='pages/MsgDetail/MsgDetail'],
uni-page[data-page='pages/SearchFriend/SearchFriend'],
uni-page[data-page='pages/AddFriendType/AddFriendType'],
uni-page[data-page='pages/Profile/Profile'],
uni-page[data-page='pages/CropperPage/CropperPage'],
uni-page[data-page='pages/AddServer/AddServer'],
uni-page[data-page='pages/InitUserInfo/InitUserInfo'] {
	.uni-page-head-hd svg {
		display: none;
	}
}
/* #endif */

.iconfont {
	vertical-align: middle;
	text-align: center;
	font-size: 34rpx;
	display: inline-block;
}
.uni-scroll-view {
	overscroll-behavior: none;
}
</style>
