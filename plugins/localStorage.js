import createPersistedState from 'vuex-persistedstate'

//export default函数是nvxt插件的固定的格式
//函数有一个参数.这参数是nuxt对象
export default ({store}) => {
    //插件的方法
  window.onNuxtReady(() => {
    createPersistedState({
        key: 'stort',//可以是任意的字符串
    })(store)
  })
}
