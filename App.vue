<script>
	import {mapMutations,mapState} from 'vuex'
	export default {
		computed:mapState(['userInfo','haslogin']),
		onLaunch: function() {//全局只触发一次
			console.log('App Launch')
			if(uni.getStorageSync('userInfo')){
				console.log("是是是",uni.getStorageSync('userInfo'))
				this.login(uni.getStorageSync('userInfo'));
			}else{
				uni.redirectTo({
					url:'./pages/guide/index'
				})
			}
		},
		onShow: function() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate((res) =>{
					console.log("res2222",res)
					 // 请求完新版本信息的回调
					 if (res.hasUpdate) {
						 updateManager.onUpdateReady(function(res2) {
							 uni.showModal({
								 title: '更新提示',
								 content: '发现新版本，是否重启应用?',
								 cancelColor:'#8F8F94',
								 confirmColor:'#007AFF',
								 success(res2) {
									 if (res2.confirm) {
										 // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										 updateManager.applyUpdate();
									 }
								 }
							 });
						 });
					}
			});
			
			
			updateManager.onUpdateFailed((res)=> {
				// 新的版本下载失败
				uni.showModal({
					title: '提示',
					content: '检查到有新版本，但下载失败，请检查网络设置',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['login'])
		}
	}
</script>

<style>
	/*每个页面公共css */
	 @import './common/uni.css';
	 @import './wxcomponents/vant/common/index.wxss';
	 page {
	     background-color: #FFFFFF;
	     height: 100%;
		 color: #404042;
	 }
</style>