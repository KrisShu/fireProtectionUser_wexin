<template>
	<view class="parameterBox">
		<view class="parameterBox_main">
			<view class="top dispaly">
				<view class="left">
					基本
				</view>
				<view class="right">
					<view class="">
						<text class="left_title">编号：</text>
						<text>{{info.deviceSn}}</text>
					</view>
					<view>
						<text class="left_title">用户：</text>
						<text>{{info.fireUnitName}}</text>
					</view>
					<view class="dispaly margin">
						<text class="left_title">联系人：</text>
						<input class="uni-input" v-model="info.contractName"   placeholder="请输入姓名" />
					</view>
					<view class="dispaly">
						<text class="left_title">手机号：</text>
						<input class="uni-input" v-model="info.contractPhone"   placeholder="请输入电话号码" />
					</view>
				</view>
			</view>
			<view class="bottom dispaly">
				<view class="left">
					参数
				</view>
				<view class="right">
					<!-- 监测范围 -->
					<view class="range">
						<view class="bottom_right_title dispaly">
							<image src="../../static/image/tip.png" mode=""></image>
							<text>监测范围</text>
						</view>
						<view class="dispaly" style="width: 60%;">
						  <text class="bottom_left_title">剩余电流：</text>
						  <input class="uni-input inputwidth" v-model="info.maxAmpere"    placeholder="自动获得焦点" />mA
						</view>
						<view class="dispaly margintb">
						  <text class="bottom_left_title">电缆温度：</text>
						  <radio-group @change="radioChange" class="radioBox">
								<label class="radio"  style="margin-right: 30rpx;">
									<radio color="#409eff" value=1 :checked="info.phaseType == 1" />单相
								</label>
								<label class="radio">
									<radio color="#409eff" :checked="info.phaseType == 2" value=2 />三相
								</label>
						  </radio-group>
						</view>
						<view class="" v-if="info.phaseType == 1">
							<view class="dispaly"  style="margin-bottom:10upx;width: 60%;">
								<text class="bottom_left_title">L：</text>
								<input class="uni-input" v-model="info.maxL"  placeholder="L温度上限" />℃
							</view>
							<view class="dispaly" style="width: 60%;">
								<text class="bottom_left_title">N：</text>
								<input class="uni-input" v-model="info.maxN" placeholder="N温度上限" />℃
								
							</view>
						</view>
						<view class="" v-if="info.phaseType == 2">
							<view class="dispaly"  style="margin-bottom:10upx;width: 60%;">
								<text class="bottom_left_title">L1：</text>
								<input class="uni-input"   v-model="info.maxL1"  placeholder="L温度上限" />℃
							</view>
							<view class="dispaly" style="width: 60%;">
								<text class="bottom_left_title">L2：</text>
								<input class="uni-input" v-model="info.maxL2"  placeholder="N温度上限" />℃
							</view>
							<view class="dispaly" style="width: 60%;">
								<text class="bottom_left_title">L3：</text>
								<input class="uni-input" v-model="info.maxL3"  placeholder="N温度上限" />℃
							</view>
							<view class="dispaly" style="width: 60%;">
								<text class="bottom_left_title">N：</text>
								<input class="uni-input" v-model="info.maxN"  placeholder="N温度上限" />℃
							</view>
						</view>
					</view>
					<!--  超限动作-->
					<view class="">
						<view class="bottom_right_title dispaly">
							<image src="../../static/image/tip.png" mode=""></image>
							<text>超限动作</text>
						</view>
						<checkbox-group @change="checkboxChange" class="margintb">
							<label>
								<checkbox value="自动断电" :checked="info.enableAlarmSwitch" color="#409eff" style="transform:scale(0.9)" />自动断电
							</label>
						</checkbox-group>
						<view class="messageBox dispaly">
							<checkbox 
							value="发送短信"
							@click="changeenableSMS"
							:checked="info.enableSMS" 
							color="#409eff" 
							style="transform:scale(0.9)" />发送短信
							<input v-if="info.enableSMS" class="uni-input" v-model="info.smsPhones"   placeholder="自动获得焦点" />
						</view>
					</view>
					
					
				</view>
			</view>
			<view class="btnBox">
				<button @click="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				info:{},
				onlycontractPhone:''
			}
		},
		onLoad(options) {
			//options可以接到index 传过来的值
			// console.log("接收参数",options)
			this.GetFireElectricDevicePara(options.id)
		},
		methods:{
			GetFireElectricDevicePara(id){
				console.log("id",id)
				this.$http.get(this.$api.GetFireElectricDevicePara,{data:{deviceId:id}}).then(res=>{
					let arr = ['1','2','3']
					// console.log("获取数据成功",res.result)
					// console.log("获取数据成功",arr)
					this.onlycontractPhone = res.result.contractPhone
					this.info = res.result
				})
			},
			radioChange(evt){
				// console.log("radioChange",evt)
				this.info.phaseType = evt.detail.value
			},
			checkboxChange(evt){
				// console.log("checkboxChange",evt)
				if(evt.detail.value.includes('终端报警')){
					console.log("dd")
					this.info.enableEndAlarm  =true;
					if(!this.info.enableAlarmList.includes('终端报警')){
						this.info.enableAlarmList.push('终端报警')
					}
					
				}else{
					this.info.enableEndAlarm  =false;
					this.del('终端报警')
				}
				
				if(evt.detail.value.includes('云端报警')){
					this.info.enableCloudAlarm  =true;
					if(!this.info.enableAlarmList.includes('云端报警')){
						this.info.enableAlarmList.push('云端报警')
					}
				}else{
					this.info.enableCloudAlarm  =false;
					this.del('云端报警')
				}
				
				if(evt.detail.value.includes('自动断电')){
					this.info.enableAlarmSwitch  =true;
					if(!this.info.enableAlarmList.includes('自动断电')){
						this.info.enableAlarmList.push('自动断电')
					}
				}else{
					this.info.enableAlarmSwitch  =false;
					this.del('自动断电')
				}
			},
			del(flag){
				this.info.enableAlarmList.forEach((item, index, arr)=>{
				    if(item == flag) {
				        arr.splice(index, 1);
				    }
				});
			},
			changeenableSMS(e){
				this.info.enableSMS = !this.info.enableSMS
				if(this.info.enableSMS){
					if(!this.info.enableAlarmList.includes('发送短信')){
						this.info.enableAlarmList.push('发送短信')
					}
				}else{
					this.del('发送短信')
				}
			},
			//提交
			submit(){
				if(!this.info.contractName || !this.info.contractPhone){
					uni.showToast({
						title:'请完善基本信息',
						icon:'none'
					})
					return
				}
				if(this.info.maxAmpere<=0 || this.info.maxL<=0 || this.info.maxN <=0){
					uni.showToast({
						title:'范围数值必须大于0',
						icon:'none'
					})
					return
				}
				
				// console.log("测试v-model",this.info.enableAlarmList)
				if(this.info.contractPhone != this.onlycontractPhone ){ //如果修改了联系人手机号
					uni.showModal({
						title: '提交修改',
						content: '您正在修改联系手机号，这也是您的登录账号，下次登录时，需以修改后的手机号登录，继续操作吗？',
						success: (res)=>{
							if (res.confirm) {
								this.requestway();
							}else{
								return
							}
						}
					})
				}else{
					this.requestway();
				}
			},
			requestway(){
				uni.showLoading({
				    title: '更新数据中...',
					mask:true
				});
				uni.request({
					url:'https://smart.sctsjkj.com/api/services/app/FireDevice/UpdateFireElectricDevicePara',
					method:'PUT',
					data:this.info,
					success: (res) => {
					        console.log(res);
							if(res.data.success){
								uni.hideLoading();
									uni.showToast({
										title:'设施参数提交成功',
										icon:'none'
									})
									
								setTimeout(()=>{uni.navigateBack()},1000)
							}else{
								uni.hideLoading();
								uni.showToast({
									title:res.data.error.message,
									icon:'none'
								})
							}
								
					    }
				});
			}
		}
	}
</script>

<style lang="scss">
		.parameterBox{
			width: 100%;
			.parameterBox_main{
				width: 100%; 
				.dispaly{
					align-items: center;
					display: flex;
				}
				// .dispaly_just{
				// 	display: ;
				// }
				.margin{
					margin-bottom: 10upx;
				}
				.margintb{
					margin: 20upx 0upx;
				}
				.top{
					width: 100%;
					padding: 30upx 10upx;
					box-sizing: border-box;
					border-bottom: 1upx solid #F0F0F0;
				}
				.left{
				  font-size: 30upx;
				  font-weight: bold;
				  flex: 0 0 auto;
				 
				  padding: 0px 20upx;
				  text-align: center;
				  display: flex;
				  align-items: center;
				
				}
				.right{
					padding: 0px 10upx 0upx 20upx;
					border-left: 1upx solid #F0F0F0;
					.left_title{
						display: inline-block;
						width: 120upx;
						color: #000000;
					}
					.uni-input{
						border: 1upx solid #F2F2F2;
						// &.inputwidth{
						// 	width: 100upx !important;
						// }
					}
				}
				.bottom{
					width: 100%;
					padding: 30upx 10upx;
					box-sizing: border-box;
					border-bottom: 1upx solid #F0F0F0;
					.bottom_right_title{
						image{
							width: 30upx;
							height: 30upx;
							margin-right: 20upx;
						}	
					}
					.bottom_left_title{
						width: 160upx;
						display: inline-block;
						color: #000000;
						text-align: right;
					}
					checkbox-group{
						display: flex;
						justify-content: space-between;
					}
					radio-group{
						width: auto;
					}
				}
				
				.btnBox{
					padding:20upx 40upx;
					margin-top: 40upx;
					button{
						background: #409eff;
						color: #FFFFFF;
					}
				}
			}
		}
</style>
