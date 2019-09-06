//state      代表数据
//mutations  同步修改state的数据
//actions    异步修改state的数据

//不许要export  const state
//用户管理
export  const state ={
    userInfo: {
        token: "",
        user:{}
    }
}

export  const mutations ={
    //设置用户信息,mutations下的方法第一个参数固定是state
    //data参数不是必须的.是调用方法时候传入的参数
    setUserInfo(state, data){
     state.userInfo = data;
    },

    //清空userInfo
    clearUserInfo(state){
        state.userInfo={
            token:'',
            user:{}
        }
    }
};

