# qjp-levitatedSphere

# 参数



| 参数    | 说明                                                         | 类型     | 默认值 |
| ------- | ------------------------------------------------------------ | -------- | ------ |
| options | 配置参数-具体看下面options中参数配置                         | object   | -      |
| func    | 点击事件执行函数,传入函数时不能带括号!!!!                    | function | -      |
| show    | 默认值为true, 为true时默认显示,为false时需要手动操作打开此悬浮框 | boolean  | true   |

# options参数配置

| 参数         | 说明                                                         | 类型    | 默认值             |
| ------------ | ------------------------------------------------------------ | ------- | ------------------ |
| viewStyle    | 具体看下方viewStyle中参数配置                                | object  | -                  |
| mainImage    | 悬浮球图片地址                                               | string  | '/static/logo.png' |
| initPosition | 首次进来时悬浮球的位置 可选值:'leftBottom'   左上 leftTop 左中 leftCenter 左下 leftBottom  右上 rightTop  右中 rightCenter 右下 rightBottom | string  | 'leftBottom'       |
| moveSpeed    | 悬浮球吸边速度                                               | number  | 0                  |
| isMove       | 是否自动吸边                                                 | boolean | true               |

# viewStyle参数配置

| 参数            | 说明                                                         | 类型   | 默认值              |
| --------------- | ------------------------------------------------------------ | ------ | ------------------- |
| backgroundColor | 悬浮球背景颜色                                               | string | rgba(255,255,255,0) |
| top             | 首次进入时,悬浮球距离屏幕上方位置,当传入top时 优先执行传入top的值, 不传top时,  执行 initPosition | number | -                   |
| left            | 首次进入时,悬浮球距离屏幕左侧的位置                          | number | -                   |
| width           | 悬浮球宽度,输入时以rpx的数值输入,不带单位                    | number | 100                 |
| height          | 悬浮球高度,同上                                              | number | 100                 |

# event

| 参数 | 说明                   | 类型     | 默认值 |
| ---- | ---------------------- | -------- | ------ |
| show | 自定义打开悬浮球的方法 | function | -      |
| hide | 自定义关闭悬浮球的方法 | function | -      |
|      |                        |          |        |



# 使用

### vue2 

可以在app.vue中直接配置,也可以在首页配置

```vue
<script>
// app.vue
    import initLevitatedSphere from '@/uni_modules/qjp-levitatedSphere/js_sdk/qjp-levitatedSphere.js';
    const options = {
        viewStyle: {
            width: 100,
            height: 100
        },
        moveSpeed: 100,
        url: '/static/logo.png',
        isMove: true
    }
    export default {
        
        
        created() {
			initLevitatedSphere(options, this.clickHandler, true);
		},
        methods: {
            clickHandler(res) {
                if (res.type == 'click') {
                    console.log('click', res);
                    uni.showToast({
                        title: '点击事件!'
                    });
                }
                if (res.type == 'move') {

                    console.log('move', res);
                }
            }
		}
    }

</script>
```





### vue3

可以在app.vue中直接配置,也可以在首页配置



```vue
<script setup>
// app.vue
    import initLevitatedSphere from '@/uni_modules/qjp-levitatedSphere/js_sdk/qjp-levitatedSphere.js';
    import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
    onLaunch(() => {
        console.log('App Launch');
        initLevitatedSphere(options, clickHandler, true);
    });
      const options = {
        viewStyle: {
            width: 100,
            height: 100
        },
        moveSpeed: 100,
        url: '/static/logo.png',
        isMove: true
    }
    const clickHandler = (res) => {
	if (res.type == 'click') {
		console.log('click', res);
		uni.showToast({
			title: '点击事件!'
		});
	}
	if (res.type == 'move') {
		
		console.log('move', res);
	}
};
</script>
```

# 自定义打开悬浮球

如果需要自定义打开悬浮球的话

可以在你需要的页面进行配置,如果需要多个页面进行控制打开的话,可以把获取的实力对象放在pinia或者vuex中,去操作实力对象中的方法, 这里只展示如何获取实力对象和自定义打开/关闭悬浮球的方法

打开悬浮球: activeCtx.value.show() // 记得使用实力方法的时候外层一定要try()catch()

关闭悬浮球:activeCtx.value.hide()

记得第三个参数赋值为false

```vue
<script setup>
    import initLevitatedSphere from '@/uni_modules/qjp-levitatedSphere/js_sdk/qjp-levitatedSphere.js';
    import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
    import {ref,onCreated} from 'vue'
    onCreated(() => {
        
      activeCtx.value = initLevitatedSphere(options, clickHandler, false);
    });
    const activeCtx = ref()
     
    const clickHandler = (res) => {
	if (res.type == 'click') {
		console.log('click', res);
		uni.showToast({
			title: '点击事件!'
		});
	}
	if (res.type == 'move') {
		
		console.log('move', res);
	}
};
</script>
```

