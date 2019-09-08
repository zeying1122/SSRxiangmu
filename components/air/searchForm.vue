<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px">
            <el-form-item label="出发城市">
                <!-- fetch-suggestions:每次输入都会执行,获取搜索建议,并且显示在输入框的下拉框中 -->
                <!-- select 在下拉框中选中时候触发的事件 -->
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                @blur="handleDepartBlur"
                class="el-autocomplete"
                v-model="form.departCity"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="到达城市">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                @blur="handlDestBlur"
                class="el-autocomplete"
                v-model="form.destCity"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                style="width: 100%;"
                @change="handleDate"
                v-model="form.departDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
import moment from "moment";
export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
            form:{
              departCity:"",
              departCode:"",
              destCity:"",
              destCode:"",
              departDate:""
            },
            departDate:[], //存储后台返回的出发城市数组
            destData:[], //存储后台返回的到达城市数组
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(index){
            if(index===1){
              this.$alert("目前暂时不支持往返","提示");
            }
        },
        
             //出发城市输入框失去焦点时候触发
             handleDepartBlur(index){
               this.form.departCity= this.departDate[0] ? this.departDate[0].value : "";
                this.form.departCode=this.departDate[0] ? this.departDate[0].sort : "";
             },

             //出发城市输入框失去焦点时候触发
             handlDestBlur(){
               this.form.destCity= this.destDate[0] ? this.destDate[0].value : "";
              this.form.destCode=this.destDate[0] ? this.destDate[0].sort:"";
             },

        // 出发城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDepartSearch(value, cb){
          if(!value){
            //传递空数组就不会出现下拉框
            cb([]);
            return;
          }
            //根据用户的输入请求建议城市
            this.$axios({
              url:'/airs/city',
              //get参数
              params:{
                //输入框的关键字
                name:value
              }
            }).then(res=>{
              //数组
              const {data}= res.data;

              //将数组中每个对象添加value属性
              const  newData=[];

              data.forEach(v=>{
                //添加value属性
                //replace("市","")意思是把带有'市'的字符变成空字符.
                v.value=v.name.replace("市","");
                //把带有value属性的对象添加到新数组中
                newData.push(v);
              });

              //把转换后的数组赋值给data
              this.departDate=newData


              //默认选中第一个(有bug.输入广元时候有bug)
              // this.form.departCity= newData[0].value;
              // this.form.departCode= newData[0].sort;
            
              cb(newData)
            })
        },

        // 目标城市输入框获得焦点时触发
        // value 是输入框选中的值，cb是回调函数，接收要展示的列表
        //cb调用时候必须要接受一个数组,数组中的元素必须是一个对象,对象中必须有value属性
        queryDestSearch(value, cb){
       if(!value){
            //传递空数组就不会出现下拉框
            cb([]);
            return;
          }
            //根据用户的输入请求建议城市
            this.$axios({
              url:'/airs/city',
              //get参数
              params:{
                //输入框的关键字
                name:value
              }
            }).then(res=>{
              //数组
              const {data}= res.data;

              //将数组中每个对象添加value属性
              const  newData=[];

              data.forEach(v=>{
                //添加value属性
                //replace("市","")意思是把带有'市'的字符变成空字符.
                v.value=v.name.replace("市","");
                //把带有value属性的对象添加到新数组中
                newData.push(v);
              });
              
              //把转换后的数组赋值给data
              this.destData=newData


              //默认选中第一个(有bug.输入广元时候有bug)
              // this.form.destCity= newData[0].value;
              // this.form.destCode= newData[0].sort;
  
               //显示到下拉列表中
              cb(newData)
            })
        },
       
        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            //把选中的值设置给form
            this.form.departCity=item.value;
            this.form.departCode=item.sort;
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            //把选中的值设置给form
            this.form.destCity=item.value;
            this.form.destCode=item.sort;
        },

        // 确认选择日期时触发
        //value会返回当前选中的日期
        handleDate(value){
          //转换
           this.form.departDate = moment(value).format('YYYY-MM-DD')
        },

        // 触发和目标城市切换时触发
        handleReverse(){
           const{departCity, departCode, destCity, destCode}=this.form;
           //交叉赋值
           this.form.departCity=destCity;
           this.form.departCode=destCode;

           this.form.destCity=departCity;
           this.form.destCode=departCode;
        },

        // 提交表单是触发
        handleSubmit(){
          const {departCity, destCity, departDate}= this.form;

          //可以这样写.也可以把他们解构出来.这样的话就比较简洁.上面是解构
          // if(!this.form.departCity){
          //   this.$alert("出发城市不能为空","提示");
          //   return;
          // }没解构就要加上this.form

          // 解构就去掉this.form
          if(!departCity){
            this.$alert("出发城市不能为空","提示");
            return;
          }
          if(!destCity){
            this.$alert("到达城市不能为空","提示");
            return;
          }
          if(!departDate){
            this.$alert("出发日期不能为空","提示");
            return;
          }
            // console.log(this.form)
            //跳转到机票列表页  /air/flights
            this.$router.push({
              path:"/air/flights",
              //url携带的参数
              query: this.form
              
            })
        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
