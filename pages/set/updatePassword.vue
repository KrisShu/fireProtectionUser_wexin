<template>
	<view class="updatePBox">
		<form @submit="updateSubmit" >
			<view class="formBox">
				<view class="uni-form-item uni-row">
					<image class="phoneIcon" src="../../static/image/wjmm_img_02.png" mode=""></image>
					<input class="uni-input" name="oldPassword" placeholder="请输入原始密码" />
				</view>
				<view class="uni-form-item uni-row">
					<image class="passwordIcon" src="../../static/image/wjmm_img_03.png" mode=""></image>
					<input class="uni-input" name="newPassword" placeholder="请设置新密码" />
				</view>
				<view class="uni-form-item uni-row">
					<image class="passwordIcon" src="../../static/image/wjmm_img_04.png" mode=""></image>
					<input class="uni-input" name="repassword" placeholder="请再次确认新密码" />
				</view>
			</view>

			<view class="btnBox">
				<button form-type="submit">提交</button>
			</view>
			
			
		</form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			updateSubmit(e){
				
					if(e.detail.value.newPassword == e.detail.value.repassword){
						var formData = e.detail.value;
						formData.account = this.$store.state.userInfo.account
						console.log("要修改的密码",formData)
						this.$http.post(this.$api.ChangePassword,formData).then(res=>{
							// console.log("修改密码成功",res)
							if(res.result.success){
								uni.showToast({ title: '修改密码成功，请重新登录', icon: "none" });
								uni.redirectTo({
									url:'../login/login'
								})
							}else{
								uni.showToast({ title: res.result.failCause, icon: "none" });
							}
						})
					}else{
						uni.showToast({ title: '新密码两次输入不一致', icon: "none" });
					}
			}
		}
	}
</script>

<style lang="scss">
	.updatePBox{
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
			}
			.btnBox{
				padding:0upx 40upx;
				margin-top: 40upx;
				button{
					background: #409eff;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
