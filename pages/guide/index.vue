<template>
	<view class="guideBox">
		<view class="topBg"></view>
		<view class="logoBox">
			<image class="logoimg" src="../../static/image/logo1.png" mode=""></image>
			<image class="logoText" src="../../static/image/logoFont.png" mode=""></image>
		</view>
		<view class="textBox">
			<text>
				欢迎使用安全用电防护系统，它是安全用电防护装置配套的居民端小程序系统。
				本系统可以自动监测配电箱线路的电缆温度和漏电流数值，发现因漏电、短路、过负荷、接触电阻过大等原因引发的电气火灾隐患，从而达到有效降低电气火灾事故发生的目标。
			</text>
			<text class="texttewo">
				请点击“去登录”按钮，输入账号密码，成功登录后即可查看安全用电防护装置运行状态及各项指标数值。
			</text>
		</view>
		<view class="btnBox">
			<button @tap="gologin">去登录</button>
			<navigator target="miniProgram" open-type="exit" >取消</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		methods:{
			gologin(){
				uni.redirectTo({
					url:'../login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	.guideBox{
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
			
		.textBox{
			padding: 80upx;
			display: flex;
			flex-direction: column;
			text{
				line-height: 2;
				&.texttewo{
					margin-top: 60upx;
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
			navigator{
				width: 100%;
				line-height: 90upx;
				text-align: center;
				background: #cccccc;
				margin-top: 20upx;
				border-radius: 5upx;
				font-size: 18px;
				color: #FFFFFF;
			}
		}
	}
</style>
