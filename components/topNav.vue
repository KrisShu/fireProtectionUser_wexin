<template>
	<view class="topNav">
		<view class="left">
			<image src="../static/image/ssgz_img_01.png" ></image>
			<text>{{username}}</text>
		</view>
		<view class="right">
			<view @click="getelectric" class="righticonimg">
				<image src="../static/image/2.png" mode=""></image>
				<image v-if="firewaringred" class="red" src="../static/image/redicon.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		computed:mapState(['userInfo','haslogin']),
		data(){
			return{
				username:this.$store.state.userInfo.name,
				firewaringred:this.$store.state.userInfo.firewaringred,
			}
		},
		mounted() {
			// console.log("ssssssssssssssssssssssssssssssssssss",this.$store.state.userInfo)
			this.username = this.$store.state.userInfo.name
		},
		created() {
			// console.log("ssssssssssssssssssssssssssssssssssss",this.$store.state.userInfo)
		},
		methods:{
			
			getelectric(){
				this.$emit('getelectric')
			}
		}
	}
</script>

<style lang="scss">
	.topNav{
		background: #17aeff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0upx 10upx;
		.left{
			color: white;
			display: flex;
			align-items:center;
			text{
			  font-size: 28upx;
			}
			image{
			  width: 40upx;
			  height: 40upx;
			  margin-right: 10upx;
			}
		       
		}
		.right{
		  .righticonimg{
			position: relative;
			width: 70upx;
		  }
		  image{
			width: 70upx;
			height: 60upx;
		  }
		  .red{
			position: absolute;
			top: -6upx;
			left: 24upx;
			width: 40upx;
			height: 40upx;
		  }
		}
	}
</style>
