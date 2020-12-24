<template>
	<view class="content">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in listData" :key="key" >
				<view class="uni-media-list">
					<view class="uni-media-list-body">
						<view class="uni-media-list-item"> <text>【设施编号】：</text> {{ value.fireElectricDeviceSn }}</view>
						<view class="uni-media-list-item"> <text>【具体位置】：</text> {{ value.location }}</view>
						<view class="uni-media-list-item"> 
						<text>【报警数值】：</text> {{value.sign}}:{{ value.analog }}
						<text class="green" v-if="value.state == 2">（良好）</text>
						<text class="yellow" v-if="value.state == -3">（隐患）</text>
						<text class="orange" v-if="value.state == -2">（超限）</text>
						<text class="gray" v-if="value.state == -1">（离线）</text>
						
						</view>
						<view class="uni-media-list-item"> <text>【报警时间】：</text> {{ value.creationTime }}</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status"  :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components:{
			uniLoadMore
		},
		computed:mapState(['userInfo','haslogin']),
		data(){
			return{
				listData:[],
				last_id:'',
				status:'loading',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				reload: false,
				page:{
					FireUnitId :this.$store.state.userInfo.fireUnitID,
					VisitSource :2,
					State:0
				},
				totalCount:0
			}
		},
		onLoad() {
			this.getList();
		},
		onReachBottom() {//页面上拉触底事件的处理函数
			if(this.totalCount > this.listData.length){
				this.status = 'more';
				this.page.SkipCount  = this.listData.length
				this.getList();
			}else{
				this.status = 'noMore'
			}
			
		},
		methods:{
			getList(){
				if (this.last_id) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
				}
				this.$http.get(this.$api.GetElectricAlarmList,{data:this.page}).then(res=>{
					console.log("列表",res)
					this.totalCount  = res.result.totalCount
					for(let arr of res.result.items){
						arr.creationTime = this.deal(arr.creationTime)
					}
					if(res.result.totalCount >0){
						let list = res.result.items
						this.listData = this.reload ?list : this.listData.concat(list);
						// this.last_id = list[list.length - 1].deviceId;
						this.reload = false;
					}else{
						// this.
						this.listData = []
					}
					if(this.totalCount == this.listData.length){
						this.reload = false;
						this.status = 'noMore'
					}
				
					
				}).catch(err=>{
					console.log("列表err",err)
				})
			},
			 //时间处理
			deal(data){
				var str = data.split('T');
				var str2 = str[1].split(".")
				var timestr = str[0] +" "+ str2[0]
				return timestr;
			},
			getcolor(state){
				if(state == 2){
					return 'green'
				}else if(state == -3){
					return 'yellow'
				}else if(state == -2){
					return 'orange'
				}else if(state == -1){
					return 'gray'
				}
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 10upx;
		.uni-list{
			.uni-media-list-body {
				height: auto;
				justify-content: space-around;
				background: rgb(232, 239, 255) !important;
				padding: 20upx;
				border-radius: 10upx;
				
				.uni-media-list-item{
					font-size: 30upx;
					color: #666666;
					text{
						color: #323233;
						&.green{
							color: rgb(46, 158, 46);
						}
						&.yellow{
							color: rgb(231, 228, 79);
						}
						&.orange{
							color: rgb(235, 108, 49);
						}
						&.gray{
							color: rgb(179, 179, 179);
						}
					}
				}
			}
		}
	}
</style>
