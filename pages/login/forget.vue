<template>
	<view class="forgetBox">
		<form @submit="Submit" >
			<view class="formBox">
				<view class="uni-form-item uni-row">
					<image class="phoneIcon" src="../../static/image/load_img_02.png" mode=""></image>
					<input class="uni-input" v-model="phone" name="phone" placeholder="请输入手机号码" />
				</view>
				<view class="uni-form-item uni-row">
					<image class="passwordIcon" src="../../static/image/load_img_03.png" mode=""></image>
					<input class="uni-input" name="newPassword" placeholder="请设置新的密码" />
				</view>
				<view class="uni-form-item uni-row">
					<image class="passwordIcon" src="../../static/image/yanz.png" mode=""></image>
					<input class="uni-input" name="verificationCode1" placeholder="请输入短信验证码" />
					<view v-if="!cutdown" @click="send" class="sendBtn">
						发送验证码
					</view>
					<view v-if="cutdown" class="sendBtn">
						{{second}}秒后重新发送
					</view>
				</view>
			</view>
		
			<view class="btnBox">
				<button form-type="submit">提交</button>
			</view>
			<view class="text">
				登录手机号是在安装安全用电防护装置时，由设备安装人员根据您提供的手机号注册的，如果忘记手机号，可拨打产品使用说明书上服务热线或设备
				铭牌标签上施工工程师电话进行咨询。
			</view>
			
			
		</form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				phone:'',
				cutdown:false,
				second:10,//倒计时秒数
				verificationCode:''
			}
		},
		methods:{
			Submit(e){
				// console.log("忘记密码修改",e)
				if(e.detail.value.phone && e.detail.value.newPassword && e.detail.value.verificationCode1){
					if( e.detail.value.verificationCode1 == this.verificationCode){
						this.$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
						this.$http.post(this.$api.ReSetPassword,e.detail.value).then(res=>{
							// console.log("修改密码成功",res)
							// this.$toast('修改密码成功，请登录')
							uni.showToast({
								title:'修改密码成功，请登录',
								icon:'none'
							})
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
						}).catch(err=>{
							// console.log("修改失败",err)
							uni.showToast({
								title:err.error.message,
								icon:'none'
							})
						})
					}else{
						uni.showToast({
							title:'验证码错误',
							icon:'none'
						})
					}
				}else{
					uni.showToast({
						title:'请将字段填写完整',
						icon:'none'
					})
				}
			},
			send(){
				if(this.phone){
					// console.log("sss")
					this.second = 60
					this.getSecond()
				}
				
			},
			getSecond(){
				this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
				this.$http.post(this.$api.SendSMSCode,{phone:this.phone}).then(res=>{
				            console.log("发送成功",res)
							if(res.success){
								this.verificationCode = res.result
								this.cutdown = true
								var interval = setInterval(() => {
								        --this.second
								}, 1000)
								setTimeout(() => {
								  clearInterval(interval)
								  this.cutdown = false
								}, 60000)
							}else{
								uni.showToast({
									title:res.error.message,
									icon:'none',
									duration:3000
								})
							}
				            
				}).catch(err=>{
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.forgetBox{
		height: 100vh;
		box-sizing: border-box;
		form{
			.formBox{
				padding: 20upx 40upx;
				margin: 0upx 0upx 40upx 0upx;
				.uni-form-item{
					align-items: center;
					.uni-input{
						background: #F4F5F6;
						margin-left: 20upx;
					}
					.phoneIcon{
						width: 36upx;
						height: 44upx;
					}
					.passwordIcon{
							width: 40upx;
							height: 40upx;
						}
					}
					.sendBtn{
						padding: 10upx 20upx;
						color: white;
						background:#409eff;
						border-radius: 4upx;
						margin-left: 20upx;
					}
				}
				.btnBox{
					padding:0upx 40upx;
					margin-top: 40upx;
					button{
						background: #409eff;
						color: #FFFFFF;
					}
				}
				.text{
					padding:40upx;
					color: #B2B2B2;
				}
		}
	}
</style>
