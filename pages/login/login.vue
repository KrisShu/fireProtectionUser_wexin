<template>
	<view class="loginBox">
		<view class="logoBox">
			<image class="logoimg" src="../../static/image/logo1.png" mode=""></image>
			<image class="logoText" src="../../static/image/logoFont.png" mode=""></image>
		</view>
		<form @submit="formSubmit" >
			<view class="formBox">
				<view class="uni-form-item specialBorder uni-row">
					<image class="phoneIcon" src="../../static/image/load_img_02.png" mode=""></image>
					<input class="uni-input" name="account" placeholder="请输入手机号码" />
				</view>
				<view class="uni-form-item uni-row">
					<image class="passwordIcon" src="../../static/image/load_img_03.png" mode=""></image>
					<input class="uni-input" password name="password" placeholder="请输入密码,默认初始密码123" />
				</view>
			</view>
			<view class="uni-form-item uni-row radiobox">
				<label class="radio">
					<!-- <radio checked="true" color="#409eff" style="transform:scale(0.9)" value="男" /><text>自动登录</text> -->
					<checkbox value="cb" checked="true" color="#409eff" style="transform:scale(0.9)" />自动登录
				</label>
				<text @tap="goToforget">忘记密码</text>
			</view>
			<view class="btnBox">
				<button form-type="submit">登录</button>
				<button @tap="cancel">取消</button>
			</view>
			
			
		</form>
		
	</view>
</template>

<script>
	var  graceChecker = require("../../common/graceChecker.js");
	import {mapState,mapMutations} from 'vuex' 
	export default {
		data(){
			return{
				
			}
		},
		methods:{
			...mapMutations(['login']),
			onClick(){
				uni.switchTab({
				    url: '/pages/index/index'
				});
			},
			//
			formSubmit(e){
				let that = this;
				console.log("登录数据",e)
				//定义表单规则
				var rule = [
				    {name:"account", checkType : "phoneno", checkRule:"1,11",  errorMsg:"请输入正确的号码"},
				    {name:"password", checkType : "notnull", checkRule:"",  errorMsg:"请输入正确的密码"}
				];
				//进行表单检查
				var formData = e.detail.value;
				formData.isPersistent = true
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){//验证通过
				    // uni.showToast({title:"验证通过!", icon:"none"});
					console.log("formData",formData)
					this.$http.post(this.$api.Login,formData).then(res=>{
						console.log("登录成功",res);
						if( !res.result.success){
							uni.showToast({title:res.result.failCause, icon: "none" })
						}else{
							this.toMain(res.result);
							
						}
						
					}).catch(err=>{
						console.log("登录失败",err)
					})
					
				}else{//验证没有通过的提示
				    uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			toMain(userinfo){
				this.login(userinfo);
				uni.switchTab({
					url:'../index/index'
				})
			},
			goToforget(){
				uni.navigateTo({
					url:'./forget'
				})
			},
			//cancel
			cancel(){
				uni.navigateTo({
					url:'../guide/index'
				})
			}
			
		}
	}
</script>

<style lang="scss">
		.loginBox{
			.logoBox{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.logoimg{
					width: 160upx;
					height: 140upx;
				}
				.logoText{
					width: 420upx;
					height: 220upx;
				}
				.logoFont{
					text{
						display: block;
						font-family: 'lishu';
					}
				}
			}
			form{
				.formBox{
					border-TOP: 1upx solid #f0f0f1;
					border-bottom: 1upx solid #f0f0f1;
					padding: 20upx 40upx;
					margin: 40upx 0upx;
					.specialBorder{
						border-bottom: 1px solid #E5E5E5;
					}
					.uni-form-item{
						display: flex;
						align-items: center;
						.uni-input{
							background: white;
							margin-left: 20upx;
						}
						.phoneIcon{
							width: 36upx;
							height: 44upx;
						}
						.passwordIcon{
							width: 36upx;
							height: 40upx;
						}
					}
				}
				.radiobox{
					padding:0upx 40upx;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					text{
						color: #636366;
					}
				
				}
				.btnBox{
					padding:0upx 40upx;
					margin-top: 40upx;
					button{
						background: #409eff;
						color: #FFFFFF;
						&:nth-child(2){
							background: #cccccc;
							margin-top: 40upx;
						}
					}
				}
			}
			
		}
</style>
