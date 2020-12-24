const API = {
	Login:"/api/services/app/FireUnitUser/UserLoginForMobile",//工程人员手机端登录
	SendSMSCode:'/api/services/app/FireUnitUser/SendSMSCode',//发送短信验证码
	UserLogout:'/api/services/app/FireUnitUser/UserLogout',//登录注销
	ReSetPassword:'/api/services/app/FireUnitUser/ReSetPassword',//重置密码（忘记密码）
	//
	GetFireElectricDeviceState:'/api/services/app/FireDevice/GetFireElectricDeviceState',//根据区域Id获取工程手机端的电气火灾设备各种状态的数量
	GetFireElectricDeviceList:'/api/services/app/FireDevice/GetFireElectricDeviceList_Resident',//    获取C端电气火灾设施列表
	ChangePassword:'/api/services/app/FireUnitUser/ChangePassword',//修改密码
	GetFireElectricDevicePara:'/api/services/app/FireDevice/GetFireElectricDevicePara',//根据Id获取电气火灾设施参数详情
	UpdateFireElectricDevicePara:'/api/services/app/FireDevice/UpdateFireElectricDevicePara',//修改电气火灾设施参数
	GetSingleElectricDeviceData:'/api/services/app/FireDevice/GetSingleElectricDeviceData',//刷新某一电气火灾设备的当前数值
	BreakoffPower:'/api/services/app/FireDevice/BreakoffPower',//发送断电信号
	GetElectricAlarmList:"/api/services/app/Alarm/GetElectricAlarmList",//电气火灾报警
	GetNoReadAlarmNumList:"/api/services/app/Alarm/GetNoReadAlarmNumList",//
}
export default API;