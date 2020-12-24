<template>
	<view class="content">
		<top-nav @getelectric='getelectric'></top-nav>
		<view class="uni-navigate-item" v-for="(item,key) in pages" :key="key" @tap="operation(item.text)" >
			<view class="display">
				<image :src="item.icon" mode=""></image>
				<text class="uni-navigate-text">{{item.text}}</text>
			</view>
			
		     <uni-icons  color="#8F8F94"  size="16" class="icon" type="arrowright"></uni-icons>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex';
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import topNav from '@/components/topNav.vue'
	export default{
		components:{
			topNav,
			uniIcons
		},
		data(){
			return{
				pages:[
					{
						text:'修改密码',
						icon:require('../../static/image/site_img_03.png')
					},
					{
						text:'产品说明',
						icon:require('../../static/image/info.png')
					},
					{
						text:'注销登录',
						icon:require('../../static/image/site_img_05.png')
					}
				]
			}
		},
		methods:{
			...mapMutations(['logout']),  
			operation(text){
				if(text == '注销登录'){
					uni.showModal({
						title: '注销登录',
						content: '确认退出登录吗？',
						success: (res)=>{
							if (res.confirm) {
								console.log('用户点击确定');
								this.$http.post(this.$api.UserLogout).then(res=>{
								  console.log('res',res)
								  this.logout();
								  uni.redirectTo({
								  	url:'../guide/index'
								  });
								  
								}).catch(err=>{
								  console.log('err',err)
								})
								
								
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else if(text == '产品说明'){
					uni.showLoading({
					    title: '打开中...',
						mask:true
					});
					uni.downloadFile({
						url: 'https://smart.sctsjkj.com/Readme_Elec.pdf',
						success: function (res) {
							console.log(" res", res)
							uni.hideLoading();
							let filePath = res.tempFilePath; //微信临时文件路径
							uni.openDocument({
								filePath: filePath, 
								fileType: 'pdf',
								success: function (res) {
									
									uni.showToast({
										title:'打开文档成功',
										icon:'none'
									})
									console.log('打开网络文档成功')
								},
								fail: function(error){
									
									uni.showToast({
										title:'打开文档失败',
										icon:'none'
									})
									console.log("打开网络文档失败")
								}
							})
						},
						fail: function (res) {
							uni.hideLoading();
							uni.showToast({
								title:res,
								icon:'none'
							})
							console.log('fail',res)
						 },
						complete: (res)=> {
							uni.hideLoading();
							uni.showToast({
								title:res,
								icon:'none'
							})
							console.log("完整",res)
						}
					})
				}else if(text == '修改密码'){
					console.log("打印跳转")
					uni.navigateTo({
						url:'./updatePassword'
					})
				}
				
			},
			getelectric(){
				uni.navigateTo({
					url:'../index/enginerring'
				})
			}
		}
		
	}
</script>

<style lang="scss">
	@import '../../common/uni-nvue.css';
	.content{
		.display{
			display: flex;
			align-items: center;
		}
		.uni-navigate-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			image{
				width: 40upx;
				height: 40upx;
				margin-right: 30upx;
			}
		}
	}
</style>
