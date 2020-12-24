<template>
	<view class="content">
		<view class="top">
			<top-nav @getelectric='getelectric'></top-nav>
			<view class="toptabbar uni-flex uni-row">
				<van-button  
					v-for="item in btnList"
					:key="item.text"
					plain
					:type="item.type"
					:icon="screensign == item.text ? 'star-o' :''"
					@click="chooseStatus(item.text)"
					
				>
					<text>{{item.text}}</text>
					<text>{{item.num}}</text>
		
				</van-button>
		</view>
		</view>
		
		<view class="content_main">
			<view class="searchView">
				<view class="inputBox">
					<uni-icons color="#999999" size="18" type="search" />
					<input  @input="clearInput" placeholder="请输入设备编号进行查询" type="text" v-model="searchVal" />
					<text class="uni-icon" v-if="showClearIcon" @click="clearIcon">&#xe434;</text>
				</view>
				<van-button type="info"  size='small'  @click="search">查询</van-button>
			</view>
		
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in listData" :key="key" >
					<view class="uni-media-list">
						<!-- <image class="uni-media-list-logo" :src="value.cover"></image> -->
						<view class="uni-media-list-body">
							<view class="uni-media-list-item"> <text>用户：</text> {{ value.fireUnitName }}</view>
							<view class="uni-media-list-item"> <text>编号：</text> {{ value.deviceSn }}</view>
							<view class="uni-media-list-item"> 
								<text>状态：</text> 
								<text class="gary" v-if="value.state == -1">离线</text>
								<text class="green" v-if="value.state == 1">在线</text>
								<text class="green" v-if="value.state == 2">良好</text>
								<text class="red" v-if="value.state == -2">超限</text>
								<text class="yellow" v-if="value.state == -3">隐患</text>
								<text class="yellow" v-if="value.state == -4">故障</text>
							</view>
							<view  @tap="callPhone(value.engineerPhone)" class="uni-media-list-item display"> 
								<text>施工：</text> 
								{{ value.engineerName }} {{ value.engineerPhone }}
								<image class="callIcon" src="../../static/image/phone.png" mode=""></image>
							</view>
							<view class="numericalBox uni-media-list-item"> 
								<text>数值：</text> 
								<view v-if="value.phaseType == 1" class="numerical">
									<view class=""><text>L：</text> {{value.l}}</view>
									<view class=""><text>N：</text> {{value.n}}</view>
									<view class="" v-if="value.existAmpere"><text>剩余电流：</text>{{value.a}}</view>
								</view>
								<view v-if="value.phaseType == 2" class="numerical">
									<view class=""><text>L1：</text> {{value.l1}}</view>
									<view class=""><text>L2：</text> {{value.l2}}</view>
									<view class=""><text>L3：</text> {{value.l3}}</view>
									<view class=""><text>N： </text> {{value.n}}</view>
									<view class="" v-if="value.existAmpere"><text>剩余电流：</text>{{value.a}}</view>
								</view>
							</view>
							<view class="btnBox">
								<van-button type="info" plain size='small'  @click="getrefresh(value.deviceId,value.state)">刷新数值</van-button>
								<van-button type="info" plain size='small'  @click="onClick(value.deviceId,value.state)">参数设置</van-button>
								<van-button type="warning" plain size='small'  @click="Poweroff(value.deviceId,value.state)">断电</van-button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status"  :icon-size="16" :content-text="contentText" />
		</view>
	</view>
</template>

<script>
	import topNav from '@/components/topNav.vue'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {mapMutations,mapState} from 'vuex'
	var dateUtils = require('../../common/util.js').dateUtils;
	export default {
		components:{
			uniSearchBar,
			uniLoadMore,
			topNav
		},
		data() {
			return {
				screensign:'全部',
				btnList:[
					{
						type:'info',
						text:'全部'
					},
					{
						type:'primary',
						text:'良好',
						num:0
					},
					{
						type:'warning',
						text:'隐患',
						num:0
					},
					{
						type:'danger',
						text:'超限',
						num:0
					},
					{
						type:'warning',
						text:'故障',
						num:0
					},
					{
						type:'default',
						text:'离线',
						num:0
					}
				],
				searchVal: '',
				listData: [],
				last_id:'',
				status: 'loading',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				reload: false,
				page: {
					fireUnitId:this.$store.state.userInfo.fireUnitID,
					isDept:this.$store.state.userInfo.isDept,
					// fireUnitId:7,
					deviceSn:'',
					state:''
				},
				totalCount:0,
				showClearIcon: false,
				clearIconFlag:false,
			}
		},
		onLoad() {//监听页面加载，其参数为上个页面传递的数据
			console.log('页面生命周期')
			if(uni.getStorageSync('userInfo')){
				console.log('onLoad登录',this.$store.state.userInfo)
			}else{
				console.log('未登录')
				uni.redirectTo({
					url:'../guide/index'
				})
			}
			
		},
		onShow() {
			// console.log('一登录',this.$store.state.userInfo)
			this.listData = [];
			this.page.SkipCount =0;
			this.page.fireUnitId = this.$store.state.userInfo.fireUnitID;
			this.page.isDept = this.$store.state.userInfo.isDept;
			this.getList();
			this.getSate();
			this.GetNoReadAlarmNumList();
		},
		onReachBottom() {//页面上拉触底事件的处理函数,下滑加载更多
			console.log("this.totalCount",this.totalCount,this.listData.length)
			if(this.totalCount > this.listData.length){//如果totalCount大于listData.length就加载更多
				this.status = 'more';
				this.page.SkipCount  = this.listData.length
				this.getList();
			}else{//停止加载
				// console.log("nnnokkkkkkkkkk")
				this.status = 'noMore'
			}
			
		},
		
		computed:mapState(['userInfo','haslogin']),
		methods: {
			getSate(){//获取顶部状态
				this.$http.get(this.$api.GetFireElectricDeviceState,{
					data:{
						FireUnitId:this.$store.state.userInfo.fireUnitID,
						isDept:this.$store.state.userInfo.isDept
					}
				}).then(res=>{
					console.log("response",res)
					this.btnList[1].num = res.result.goodNum
					this.btnList[2].num = res.result.badNum
					this.btnList[3].num = res.result.warnNum
					this.btnList[4].num = res.result.faultNum
					this.btnList[5].num = res.result.offlineNum
				}).catch(error=>{
					console.log("err",error)
				})
			},
			chooseStatus(sign){
				this.screensign = sign
				this.page.deviceSn =''
				this.searchVal =''
				if(sign == '全部'){
					this.page.state = ''
				}else{
					this.page.state = sign
				}
				this.page.SkipCount =0;
				
				this.listData = []
				this.getList();
			},
			clearInput(event) {
			    if (event.detail.value.length > 0) {
			        this.showClearIcon = true;
			    } else {
			        this.showClearIcon = false;
			    }
			},
			//清空
			clearIcon(){
				this.searchVal = '';
				this.showClearIcon = false;
				
			},
			search() {
				// console.log("searchVa",this.searchVal)
				this.clearIconFlag = true;
				this.screensign ="";
				this.page.state = '';
				this.page.deviceSn = this.searchVal;
				this.listData = []
				this.getList();
			},
			//获取列表
			getList() {
				if (this.last_id) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
					this.page.MaxResultCount = 6;
				}
				this.$http.get(this.$api.GetFireElectricDeviceList,{data:this.page}).then(res=>{
					// console.log("列表",res)
					this.totalCount  = res.result.totalCount
					if(res.result.totalCount >0){
						// console.log("大于0")
						let list = res.result.items
						this.listData = this.reload ?list : this.listData.concat(list);
						this.last_id = list[list.length - 1].deviceId;
						this.reload = false;
					}else{
						// console.log("小于0")
						this.listData = [];
					}
					
					if(this.totalCount == this.listData.length){
						this.reload = false;
						this.status = 'noMore'
					}
				
					
				}).catch(err=>{
					// console.log("列表err",err)
				})
			},
			//拨打电话
			callPhone(phone){
				// console.log("要拨打的电话",phone);
				uni.showModal({
					title: '拨打电话',
					content: '是否拨打该用户联系电话？',
					success: (res)=>{
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber:phone
							})
							
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			//数值刷新
			getrefresh(id,state){
				if(state == -1){
					uni.showToast({
						icon:'none',
						title:'设备当前状态为离线，请先联系施工人员处理',
						duration:3000
					})
					return
				}
				uni.showLoading({
				    title: '刷新数值中',
					mask:true
				});
				this.$http.get(this.$api.GetSingleElectricDeviceData,{data:{electricDeviceId:id} }).then(res=>{
					// console.log("刷新数据成功",res);
					uni.hideLoading();
					if(res.result.result){
						uni.showToast({
							title:'刷新成功',
							icon:'none'
						})
						this.listData.forEach((item,index)=>{
						      if(item.deviceId == deviceId){
									this.$set(this.listData[index],'l',res.result.deviceData.l)
									this.$set(this.listData[index],'l1',res.result.deviceData.l1)
									this.$set(this.listData[index],'l1',res.result.deviceData.l1)
									this.$set(this.listData[index],'l2',res.result.deviceData.l2)
									this.$set(this.listData[index],'l3',res.result.deviceData.l3)
									this.$set(this.listData[index],'n',res.result.deviceData.n)
									this.$set(this.listData[index],'a',res.result.deviceData.a)
								}
						})
						
						
					}else{
						uni.showToast({
							title:'刷新数值超时，请稍后再试',
							icon:'none'
						})
					}
				})
				
			},
			//断电
			Poweroff(id,state){
				if(state == -1){
					uni.showToast({
						icon:'none',
						title:'设备当前状态为离线，请先联系施工人员处理',
						duration:3000
					})
					return
				}
				uni.showModal({
					title: '断电通知',
					content: '您确认要对该设备所在线路执行断电操作吗？',
					success: (res)=>{
						if (res.confirm) {
							// console.log('用户点击确定');
							this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
							this.$http.post(this.$api.BreakoffPower, {electricDeviceId:id}).then(res=>{
								// console.log("断电成功",res)
								uni.showToast({
									title:'已发送断电指令',
									icon:'none'
								})
							})
							
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			onClick(id,state){
				if(state == -1){
					uni.showToast({
						icon:'none',
						title:'设备当前状态为离线，请先联系施工人员处理',
						duration:3000
					})
					return
				}
				uni.navigateTo({
				    url: `./details?id=${id}`
				});
				
			},
			getelectric(){
				uni.navigateTo({
					url:'./enginerring'
				})
			},
			...mapMutations(['isread']),
			GetNoReadAlarmNumList(){
				// console.log("dddddddd")
			      let fireUnitId = this.$store.state.userInfo.fireUnitID;
			      this.$http.get(this.$api.GetNoReadAlarmNumList,{
			        data:{fireUnitId}
			      }).then(res=>{
			        // console.log("是否未读",res)
			        if(res.result[1].noReadAlarmNum>0){
			          this.isread(true)
			        }else{
					  this.isread(false)
					}
			      }).catch(err=>{
			        // console.log("是否未读",err)
			      })
			},
		}
	}
</script>

<style lang="scss">
	.content {
		// padding: 10upx 20upx;
		padding-top: 180upx;
		height: 100%;
		box-sizing: border-box;
		.display{
			display: flex;
			align-items: center;
		}
		.top{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100%;
		}
		.toptabbar{
			width: 100%;
			display: flex;
			justify-content:space-between;
			height: 120upx;
			background: #FFFFFF;
			padding: 10upx 20upx;
			box-sizing: border-box;
			van-button{
				text{
					display: block;
					line-height: 1.3;
				}
				button{
					width: 120upx;
				}
			}
			.van-button--normal{
				padding: 0upx  10upx !important;
			}
			
		
		}
		
		.content_main{
			padding: 10upx 20upx;
		}
		.searchView{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 20upx 0upx;
			.inputBox{
				display: flex;
				align-items: center;
				border: 1upx solid #CCCCCC;
				border-radius: 8upx;
				flex: 2 0 auto;
				background: #F4F5F6;
				margin-right: 10upx;
				padding: 0upx 10upx;
				input {
					height: 2rem;
					width: 100%;
					margin-left: 20upx;
				}
				.uni-icon{
					color: #CCCCCC;
				}
			}
		}
		
		.uni-list{
			.uni-media-list-body {
				height: auto;
				justify-content: space-around;
				.uni-media-list-item{
					font-size: 30upx;
					.callIcon{
						width: 40upx;
						height: 40upx;
						margin-left: 30upx;
					}
					&>text{
						font-weight: bold;
						&.gary{
							color: #cccccc;
						}
						&.green{
							color: #07c160;
						}
						&.yellow{
							color: #ff976a;
						}
						&.red{
							color: #ee0a24;
						}
					}
					&.numericalBox{
						display: flex;
					}
				}
			}
		
		}
		.btnBox{
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;
			button{
				width: 200upx;
			}
		}
		
	}
	
</style>
