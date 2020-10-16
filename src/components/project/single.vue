<template>
  <div>
    <el-button @click="echartsTest">查看图</el-button>
    <div id="echartsEle">
    
    </div>
  </div>

</template>
<script>
// import echarts from 'echarts'
export default {
  data() {
    return {};
  },
  methods: {
    echartsTest() {
      let option = {
          backgroundColor: '#2c343c',
    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name: '这是个啥？',
            type: 'pie',
            radius: '55%',
            data:[
                {value:235, name:'视频广告'},
                {value:274, name:'联盟广告'},
                {value:310, name:'邮件营销'},
                {value:335, name:'直接访问'},
                {value:400, name:'搜索引擎'}
            ],
            roseType: 'angle',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
    
};
    //   {
    //     color: ["#0E5DAE"],
    //     tooltip: {
    //       trigger: "axis",
    //       axisPointer: {
    //         type: "shadow",
    //       },
    //     },
    //     xAxis: [
      
    //       {
    //         type: "category",
    //         data: [
    //           "调度优化",
    //           "智能解析",
    //           "数据表",
    //           "字典工具",
    //           "映射工具",
    //         ],
    //         axisLabel: {
    //                 color: '#060606',
    //                 fontSize: 9,//如果全部显示不开,可以选择字体大小
    //                 interval:0 //控制是否全部显示
    //             },
    //         axisTick: {
    //           alignWithLabel: true,
    //         },
    //       },
    //     ],
    //     yAxis: [
    //       {
    //         type: "value",
    //       },
    //     ],
    //     series: [
    //       {
    //         name: "BUG数量",
    //         type: "bar",
    //         barWidth: "60%",
    //         data: [30, 4, 6, 8, 5],
    //       },
    //     ],
    //   };
    let myChart = this.echarts.init(document.getElementById('echartsEle'));
    myChart.setOption(option);
},
  },
};
</script>
<style scoped>
    #echartsEle{
    width: 80%;
    height: 500px;
    border: 1px solid red;
    margin: 0 auto;
  }
</style>
