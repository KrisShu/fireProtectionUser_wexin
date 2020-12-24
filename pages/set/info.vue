<template>
	<view>
		<button @click="get" type="default">点击</button>
		<!-- <web-view :src="url"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				viewerUrl: '/hybrid/html/web/viewer.html',
				fileUrl: 'https://smart.sctsjkj.com/Readme_Elec.pdf',
				url:'',
			}
		},
		onLoad() {
			this.url = `${this.viewerUrl}?file=${encodeURIComponent(this.fileUrl)}`;

		},
		methods:{
				//预览网络文档
			get(){
				wx.downloadFile({
					url: 'https://smart.sctsjkj.com/Readme_Elec.pdf', // url，并非真实存在
					success: function (res) {
						console.log(" res", res)
						let filePath = res.tempFilePath; //微信临时文件路径
						wx.openDocument({
							filePath: filePath, 
				            showMenu: false,  //是否显示右上角菜单按钮  默认为false
							success: function (res) {
								console.log('打开网络文档成功')
							},
							fail: function(error){
								console.log("打开网络文档失败")
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
</style>
