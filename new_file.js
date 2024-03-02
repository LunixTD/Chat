< template >
	<
	view class = "bottomBox": style = "{ transform: 'translateY(' + bottomBoxRaiseHeight + 'rpx)' }" >
	<
	view class = "mainBox" >
	<
	view class = "btnBox"
@click = "chooseImage" > < i class = "iconfont icon-add1" > < /i></view >
	<
	view class = "inputBox" >
	<
	!--抖音小程序不支持linechange-- >
	<
	textarea
v - model = "inputText"
class = "textarea": style = "{ height: inputHeight + 'rpx' }"
maxlength = "1000"
cursor - spacing = "52": focus = "inputFocus": hold - keyboard = "true": confirm - hold = "true": fixed = "true":
	adjust - position = "false": ignoreCompositionEvent = "false"
@input = "handleInput"
@linechange = "linechange"
@focus = "onInputFocus"
@blur = "onInputBlur"
@keyboardheightchange = "onKeyboardheightchange" /
	>
	<
	i class = "iconfont icon-xiaolian": style = "{ top: iconTop + 'rpx' }"
@click = "toggleContentBox('emoji')" > < /i> <
	/view> <
	view class = "btnBox": class = "msgType == 'text' ? 'textBg' : ''" >
	<
	i class = "iconfont icon-yuyin": class = "msgType == 'text' ? 'hide' : 'show'" > < /i> <
	i class = "iconfont icon-fasong": class = "msgType == 'text' ? 'show' : 'hide'"
@touchend.prevent = "sendMsg" > < /i> <
	/view> <
	/view> <
	view class = "content-box": class = "showContentBox ? 'show' : 'hide'" >
	<
	scroll - view scroll - y = "true"
class = "emojiBox": enable - flex = "true" >
	<
	image @click = "chooseEmojiImg(index)": src = "item"
mode = "widthFix"
v -
	for = "(item, index) in emojiArr"
class = "emojiImg" > < /image> <
/scroll-view> <
/view> <
/view> <
/template>

<
script setup >
	import {
		computed,
		ref,
		defineProps,
		watch,
		defineEmits,
		toRaw,
		nextTick
	} from 'vue';
import {
	useStore
} from 'vuex';
import {
	px2upx
} from '@/utils/tools.js';
import variable from '../../styles/variable.js';
const store = useStore();
const msgType = ref('voice');

const emojiArr = [
	'../../static/emoji/emoji (1).webp',
	'../../static/emoji/emoji (2).webp',
	'../../static/emoji/emoji (3).webp',
	'../../static/emoji/emoji (4).webp',
	'../../static/emoji/emoji (5).webp',
	'../../static/emoji/emoji (6).webp',
	'../../static/emoji/emoji (7).webp',
	'../../static/emoji/emoji (8).webp',
	'../../static/emoji/emoji (9).webp',
	'../../static/emoji/emoji (10).webp',
	'../../static/emoji/emoji (11).webp',
	'../../static/emoji/emoji (12).webp',
	'../../static/emoji/emoji (13).webp',
	'../../static/emoji/emoji (14).webp',
	'../../static/emoji/emoji (15).webp',
	'../../static/emoji/emoji (16).webp',
	'../../static/emoji/emoji (17).webp',
	'../../static/emoji/emoji (18).webp',
	'../../static/emoji/emoji (19).webp',
	'../../static/emoji/emoji (20).webp',
	'../../static/emoji/emoji (21).webp',
	'../../static/emoji/emoji (22).webp',
	'../../static/emoji/emoji (23).webp',
	'../../static/emoji/emoji (24).webp',
	'../../static/emoji/emoji (25).webp',
	'../../static/emoji/emoji (26).webp',
	'../../static/emoji/emoji (27).webp',
	'../../static/emoji/emoji (28).webp',
	'../../static/emoji/emoji (29).webp',
	'../../static/emoji/emoji (30).webp',
	'../../static/emoji/emoji (31).webp',
	'../../static/emoji/emoji (32).webp',
	'../../static/emoji/emoji (33).webp',
	'../../static/emoji/emoji (34).webp',
	'../../static/emoji/emoji (35).webp',
	'../../static/emoji/emoji (36).webp',
	'../../static/emoji/emoji (37).webp',
	'../../static/emoji/emoji (38).webp',
	'../../static/emoji/emoji (39).webp',
	'../../static/emoji/emoji (40).webp',
	'../../static/emoji/emoji (41).webp',
	'../../static/emoji/emoji (42).webp',
	'../../static/emoji/emoji (43).webp',
	'../../static/emoji/emoji (44).webp',
	'../../static/emoji/emoji (45).webp',
	'../../static/emoji/emoji (46).webp',
	'../../static/emoji/emoji (47).webp',
	'../../static/emoji/emoji (48).webp',
	'../../static/emoji/emoji (49).webp',
	'../../static/emoji/emoji (50).webp',
	'../../static/emoji/emoji (51).webp',
	'../../static/emoji/emoji (52).webp',
	'../../static/emoji/emoji (53).webp',
	'../../static/emoji/emoji (54).webp',
	'../../static/emoji/emoji (55).webp',
	'../../static/emoji/emoji (56).webp',
	'../../static/emoji/emoji (57).webp',
	'../../static/emoji/emoji (58).webp',
	'../../static/emoji/emoji (59).webp',
	'../../static/emoji/emoji (60).webp',
	'../../static/emoji/emoji (61).webp',
	'../../static/emoji/emoji (62).webp',
	'../../static/emoji/emoji (63).webp',
	'../../static/emoji/emoji (64).webp',
	'../../static/emoji/emoji (65).webp',
	'../../static/emoji/emoji (66).webp',
	'../../static/emoji/emoji (67).webp',
	'../../static/emoji/emoji (68).webp',
	'../../static/emoji/emoji (69).webp',
	'../../static/emoji/emoji (70).webp',
	'../../static/emoji/emoji (71).webp',
	'../../static/emoji/emoji (72).webp',
	'../../static/emoji/emoji (73).webp',
	'../../static/emoji/emoji (74).webp',
	'../../static/emoji/emoji (75).webp',
	'../../static/emoji/emoji (76).webp',
	'../../static/emoji/emoji (77).webp',
	'../../static/emoji/emoji (78).webp',
	'../../static/emoji/emoji (79).webp',
	'../../static/emoji/emoji (80).webp',
	'../../static/emoji/emoji (81).webp',
	'../../static/emoji/emoji (82).webp',
	'../../static/emoji/emoji (83).webp'
];
const emojiList = {
	emoji1: '../../static/emoji/emoji (1).webp',
	emoji2: '../../static/emoji/emoji (2).webp',
	emoji3: '../../static/emoji/emoji (3).webp',
	emoji4: '../../static/emoji/emoji (4).webp',
	emoji5: '../../static/emoji/emoji (5).webp',
	emoji6: '../../static/emoji/emoji (6).webp',
	emoji7: '../../static/emoji/emoji (7).webp',
	emoji8: '../../static/emoji/emoji (8).webp',
	emoji9: '../../static/emoji/emoji (9).webp',
	emoji10: '../../static/emoji/emoji (10).webp',
	emoji11: '../../static/emoji/emoji (11).webp',
	emoji12: '../../static/emoji/emoji (12).webp',
	emoji13: '../../static/emoji/emoji (13).webp',
	emoji14: '../../static/emoji/emoji (14).webp',
	emoji15: '../../static/emoji/emoji (15).webp',
	emoji16: '../../static/emoji/emoji (16).webp',
	emoji17: '../../static/emoji/emoji (17).webp',
	emoji18: '../../static/emoji/emoji (18).webp',
	emoji19: '../../static/emoji/emoji (19).webp',
	emoji20: '../../static/emoji/emoji (20).webp',
	emoji21: '../../static/emoji/emoji (21).webp',
	emoji22: '../../static/emoji/emoji (22).webp',
	emoji23: '../../static/emoji/emoji (23).webp',
	emoji24: '../../static/emoji/emoji (24).webp',
	emoji25: '../../static/emoji/emoji (25).webp',
	emoji26: '../../static/emoji/emoji (26).webp',
	emoji27: '../../static/emoji/emoji (27).webp',
	emoji28: '../../static/emoji/emoji (28).webp',
	emoji29: '../../static/emoji/emoji (29).webp',
	emoji30: '../../static/emoji/emoji (30).webp',
	emoji31: '../../static/emoji/emoji (31).webp',
	emoji32: '../../static/emoji/emoji (32).webp',
	emoji33: '../../static/emoji/emoji (33).webp',
	emoji34: '../../static/emoji/emoji (34).webp',
	emoji35: '../../static/emoji/emoji (35).webp',
	emoji36: '../../static/emoji/emoji (36).webp',
	emoji37: '../../static/emoji/emoji (37).webp',
	emoji38: '../../static/emoji/emoji (38).webp',
	emoji39: '../../static/emoji/emoji (39).webp',
	emoji40: '../../static/emoji/emoji (40).webp',
	emoji41: '../../static/emoji/emoji (41).webp',
	emoji42: '../../static/emoji/emoji (42).webp',
	emoji43: '../../static/emoji/emoji (43).webp',
	emoji44: '../../static/emoji/emoji (44).webp',
	emoji45: '../../static/emoji/emoji (45).webp',
	emoji46: '../../static/emoji/emoji (46).webp',
	emoji47: '../../static/emoji/emoji (47).webp',
	emoji48: '../../static/emoji/emoji (48).webp',
	emoji49: '../../static/emoji/emoji (49).webp',
	emoji50: '../../static/emoji/emoji (50).webp',
	emoji51: '../../static/emoji/emoji (51).webp',
	emoji52: '../../static/emoji/emoji (52).webp',
	emoji53: '../../static/emoji/emoji (53).webp',
	emoji54: '../../static/emoji/emoji (54).webp',
	emoji55: '../../static/emoji/emoji (55).webp',
	emoji56: '../../static/emoji/emoji (56).webp',
	emoji57: '../../static/emoji/emoji (57).webp',
	emoji58: '../../static/emoji/emoji (58).webp',
	emoji59: '../../static/emoji/emoji (59).webp',
	emoji60: '../../static/emoji/emoji (60).webp',
	emoji61: '../../static/emoji/emoji (61).webp',
	emoji62: '../../static/emoji/emoji (62).webp',
	emoji63: '../../static/emoji/emoji (63).webp',
	emoji64: '../../static/emoji/emoji (64).webp',
	emoji65: '../../static/emoji/emoji (65).webp',
	emoji66: '../../static/emoji/emoji (66).webp',
	emoji67: '../../static/emoji/emoji (67).webp',
	emoji68: '../../static/emoji/emoji (68).webp',
	emoji69: '../../static/emoji/emoji (69).webp',
	emoji70: '../../static/emoji/emoji (70).webp',
	emoji71: '../../static/emoji/emoji (71).webp',
	emoji72: '../../static/emoji/emoji (72).webp',
	emoji73: '../../static/emoji/emoji (73).webp',
	emoji74: '../../static/emoji/emoji (74).webp',
	emoji75: '../../static/emoji/emoji (75).webp',
	emoji76: '../../static/emoji/emoji (76).webp',
	emoji77: '../../static/emoji/emoji (77).webp',
	emoji78: '../../static/emoji/emoji (78).webp',
	emoji79: '../../static/emoji/emoji (79).webp',
	emoji80: '../../static/emoji/emoji (80).webp',
	emoji81: '../../static/emoji/emoji (81).webp',
	emoji82: '../../static/emoji/emoji (82).webp',
	emoji83: '../../static/emoji/emoji (83).webp'
};

const iconTop = computed(() => {
	const textareaheight = store.state.ui.inputHeight;
	let top = 0;
	// 324为底部输入框最大高度，单位rpx
	if (textareaheight < 324) {
		top = textareaheight / 2 - 18;
	} else {
		top = 162 - 18;
	}
	if (top < 0) {
		top = 0;
	}
	return top;
});

const inputHeight = computed(() => {
	return store.state.ui.inputHeight;
});

// 输入框高度变化时更改vuex中的高度数值,带动页面向上移动，防止输入框遮挡
function linechange(e) {
	let inputHeight = e.detail.heightRpx;
	if (e.detail.heightRpx > variable.ChatInputMaxHeight) {
		inputHeight = variable.ChatInputMaxHeight;
	}
	store.dispatch('ui/changeInputHeight', inputHeight);
}

function chooseImage() {
	console.log('选择本地图片');
	uni.chooseImage({
		count: 1,
		sizeType: ['original'],
		sourceType: ['album'],
		success: function(res) {
			console.log(JSON.stringify(res.tempFilePaths));
		}
	});
}

// 处理输入内容
const {
	text
} = defineProps(['text']);
const emit = defineEmits(['updateText']);
const inputText = ref(text);
watch(
	inputText,
	(val) => {
		emit('updateText', val);
		if (val === '') {
			msgType.value = 'voice';
		} else {
			msgType.value = 'text';
		}
	}, {
		deep: true
	}
);

// 发送消息
function sendMsg() {
	// console.log('发送');
	store.dispatch('chat/addMsgToList', {
		id: '00001',
		uid: '11111',
		user: 'tudou',
		date: new Date().getTime(),
		content: inputText.value
	});
	inputText.value = '';
}

// 底部输入框相关操作
const contentBoxHeight = 400;
const showContentBox = ref(false);
const inputFocus = ref(false);
const keyboardHeight = ref(0);
// 打开输入框底部菜单
function toggleContentBox(type) {
	inputFocus.value = false;
	showContentBox.value = !showContentBox.value;
	msgPageRaiseForContentBox(showContentBox.value);
}

// 底部输入框生起高度
const bottomBoxRaiseHeight = computed(() => {
	let height = contentBoxHeight;
	if (showContentBox.value) {
		height = 0;
	}
	if (keyboardHeight.value !== 0) {
		// 假定键盘高度大于contentBox高度;
		height = contentBoxHeight - px2upx(keyboardHeight.value);
	}
	return height;
});

function onInputFocus(e) {
	keyboardHeight.value = e.detail.height;
	// #ifdef APP
	msgPageRaiseForContentBox(true, px2upx(e.detail.height));
	// #endif
	if (showContentBox.value) {
		showContentBox.value = false;
		// #ifndef APP
		msgPageRaiseForContentBox(showContentBox.value);
		// #endif
	}
}

function onInputBlur() {
	keyboardHeight.value = 0;
	msgPageRaiseForContentBox(false);
}

// 选择emoji图片
function chooseEmojiImg(index) {
	inputText.value += `[emoji${index + 1}]`;
}

// 高度为rpx单位
function msgPageRaiseForContentBox(bool, height) {
	// 固定数值,后续需要换成变量
	// console.log(height);
	const contentHeight = bool ? contentBoxHeight : 0;
	store.dispatch('ui/changeMsgPageRaiseHeight', height ? height : contentHeight);
}

// 键盘高度处理
function onKeyboardheightchange(e) {
	// alert(e.detail.height);
}

function handleInput(e) {
	// console.log(e.detail);
}

function deleteEmojiTextChecker() {
	console.log(111);
} <
/script>

<
script module = "keyboard"
lang = "renderjs" >
	export default {
		setup() {
			return '';
		},
		mounted() {
			document.addEventListener('keydown', (e) => {
				if (e.keyCode === 8) {
					this.$ownerInstance.callMethod('deleteEmojiTextChecker')
					e.preventDefault()
				}
			}, false)
		}
	} <
	/script>

	<
	style lang = "scss" >
	.bottomBox {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100 vw;
		// height: 88rpx;
		height: auto;
		background - color: $ThemeDark3Color;
		// background-color: red;
		border - top: 1 px solid rgba(0, 0, 0, 0.03);
		@include centering;
		flex - direction: column;
		z - index: 10;
		transition: transform ease 0.3 s,
		bottom ease 0.3 s;

		.mainBox {
			width: 100 vw;
			@include centering;
			justify - content: space - evenly;
			padding: 9 rpx 0 rpx;

			.btnBox {
				position: relative;
				width: 80 rpx;
				height: 80 rpx;
				transition: background ease 0.3 s; &
				.textBg {
					background - color: $ThemePrimaryColor;
				}

				.iconfont {
					width: 80 rpx;
					heigth: 80 rpx;
					line - height: 80 rpx;
					position: absolute;
					top: 0;
					left: 0;
				}
			}

			.inputBox {
				position: relative;
				@include centering;
				.textarea {
					box - sizing: content - box;
					background - color: $ThemeLightColor;
					width: calc(100 vw - 64 rpx - 140 rpx - 114 rpx - 12 rpx);
					min - height: 46 rpx;
					// height: 32rpx;
					max - height: $ChatInputMaxHeight;
					line - height: 46 rpx;
					padding - left: 28 rpx;
					padding - right: 86 rpx;
					padding - top: 17 rpx;
					padding - bottom: 15 rpx;
					border - radius: 39 rpx;
					// text-indent: 28rpx;
					color: $FontWhite;
					font - size: 28 rpx;
					// white-space: pre-wrap;
					transition: height ease 0.3 s;::-webkit - scrollbar {
						width: 6 rpx;
					}::-webkit - scrollbar - thumb {
						border - radius: 6 rpx;
						background - color: $ThemeDark1Color;
					}
				}
				.iconfont {
					width: 70 rpx;
					height: 70 rpx;
					line - height: 70 rpx;
					text - align: center;
					vertical - align: middle;
					font - size: 52 rpx;
					position: absolute;
					right: 8 rpx;
					top: 8 rpx;
					transition: top ease 0.3 s;
				}
			}
		}

		.content - box {
			width: 100 vw;
			height: 400 rpx;
			// text-align: center;
			// background-color: lightblue;
			// display: none;
			opacity: 0;
			transition: opacity ease 0.3 s;
			opacity: 0;
			.emojiBox {
				width: 100 % ;
				height: 400 rpx;
				padding: 0 10 rpx;
				padding - bottom: 10 rpx;
				@include centering;
				justify - content: space - evenly;
				.emojiImg {
					width: 10 % ;
					height: 10 % ;
				}
			} &
			.hide {
				opacity: 0;
			} &
			.show {
				opacity: 1;
			}
		}
	}

	// 按钮样式
	.btnBox {
		width: 60 rpx;
		height: 60 rpx;
		border - radius: 50 % ;
		background - color: $ThemeDark1Color;
		@include centering;

		&
		.iconfont {
			transition: all ease 0.3 s;
		}

		&
		.hide {
			opacity: 0;
			// display: none;
		} &
		.show {
			opacity: 1;
			// display: block;
		}
	} <
	/style>