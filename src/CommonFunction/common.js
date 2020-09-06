
import axios from 'axios'
import vm from '../main.js'
import { compile } from 'vue-template-compiler'
export default {
  test: function () {
    console.log('common测试')
  },

  test1: function (params) {
    console.log(params)
  },

  getAllDataSource: async function () {
    const { data: response } = await axios.get('/getDataSourceConfig')
    if (response.code == 10000) {
      return response.data
    } else {
      vm.$message.error(response.msg)
    }
  },
  // 获取全部项目
  async getAllProtocol () {
    const { data: response } = await axios.get('/getAllProtocol')
    if (response.code == 10000) {
      return response.data
    } else {
      vm.$message.error(response.msg)
    }
  },
  // 获取全部协议
  async getAllProject () {
    const { data: response } = await axios.get('/getAllProject')
    if (response.code == 10000) {
      return response.data
    } else {
      vm.$message.error(response.msg)
    }
  },

  // async ErrorTest(){
  //     return await axios.get('/getError');
  // }

  async getComponentInfoById (cid) {
    const { data: response } = await axios.get('/getComponentById?id=' + cid)
    if (response.code == 10000) {
      return response.data
    } else {
      vm.$message.error(response.msg)
    }
  },

  // 公共get请求
  async get (url, params) {
    const axiosData = await axios.get(url, {
      params: params
    })
    if (axiosData.status == 200) {
      return axiosData.data
    } else {
      vm.$message.error('服务器繁忙，请稍后重试')
    }
  },

  // 公共post请求
  async post (url, params) {
    const axiosData = await axios.post(url, params)
    if (axiosData.status == 200) {
      return axiosData.data
    } else {
      vm.$message.error('服务器繁忙，请稍后重试')
      return axiosData.data
    }
  },

  async getAllComponent () {
    const axiosData = await axios.get('/getComponentList')
    if (axiosData.status == 200) {
      if (axiosData.data.code == 10000) {
        return axiosData.data.data
      } else {
        vm.$message.error(axiosData.data.msg)
      }
    } else {
      vm.$message.error('服务器繁忙，请稍后重试')
    }
  },
  //  json校验
  isJSON (str) {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str)
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e)
        return false
      }
      return true
    }
  },
  checkSessionProject () {
    if (window.sessionStorage.getItem('projectId') != null && window.sessionStorage.getItem('projectName') != null) {
      // console.log("获取");
      this.$global.currentProjectId = window.sessionStorage.getItem('projectId')
      this.$global.currentProjectName = window.sessionStorage.getItem('projectName')
    }
  },
  // 格式json方法
  formatJson (jsonObj) {
  // 正则表达式匹配规则变量
    var reg = null
    // 转换后的字符串变量
    var formatted = ''
    // 换行缩进位数
    var pad = 0
    // 一个tab对应空格位数
    var PADDING = '    '
    // json对象转换为字符串变量
    var jsonString = jsonObj
    if (!jsonString) {
      return jsonString
    }
    // 存储需要特殊处理的字符串段
    var _index = []
    // 存储需要特殊处理的“再数组中的开始位置变量索引
    var _indexStart = null
    // 存储需要特殊处理的“再数组中的结束位置变量索引
    var _indexEnd = null
    // 将jsonString字符串内容通过\r\n符分割成数组
    var jsonArray = []
    // 正则匹配到{,}符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n')
    // 正则匹配到[,]符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n')
    // 正则匹配到,符号则在两边添加回车换行
    jsonString = jsonString.replace(/(\,)/g, '$1\r\n')
    // 正则匹配到要超过一行的换行需要改为一行
    jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n')
    // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
    jsonString = jsonString.replace(/\r\n\,/g, ',')
    // 特殊处理双引号中的内容
    jsonArray = jsonString.split('\r\n')
    jsonArray.forEach(function (node, index) {
      // 获取当前字符串段中"的数量
      var num = node.match(/\"/g) ? node.match(/\"/g).length : 0
      // 判断num是否为奇数来确定是否需要特殊处理
      if (num % 2 && !_indexStart) {
        _indexStart = index
      }
      if (num % 2 && _indexStart && _indexStart != index) {
        _indexEnd = index
      }
      // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
      if (_indexStart && _indexEnd) {
        _index.push({
          start: _indexStart,
          end: _indexEnd
        })
        _indexStart = null
        _indexEnd = null
      }
    })
    // 开始处理双引号中的内容，将多余的"去除
    _index.reverse().forEach(function (item, index) {
      var newArray = jsonArray.slice(item.start, item.end + 1)
      jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
    })
    // 奖处理后的数组通过\r\n连接符重组为字符串
    jsonString = jsonArray.join('\r\n')
    // 将匹配到:后为回车换行加大括号替换为冒号加大括号
    jsonString = jsonString.replace(/\:\r\n\{/g, ':{')
    // 将匹配到:后为回车换行加中括号替换为冒号加中括号
    jsonString = jsonString.replace(/\:\r\n\[/g, ':[')
    // 将上述转换后的字符串再次以\r\n分割成数组
    jsonArray = jsonString.split('\r\n')
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item, index) {
      // console.log(item)
      var i = 0
      // 表示缩进的位数，以tab作为计数单位
      var indent = 0
      // 表示缩进的位数，以空格作为计数单位
      var padding = ''
      if (item.match(/\{$/) || item.match(/\[$/)) {
        // 匹配到以{和[结尾的时候indent加1
        indent += 1
      } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
        // 匹配到以}和]结尾的时候indent减1
        if (pad !== 0) {
          pad -= 1
        }
      } else {
        indent = 0
      }
      for (i = 0; i < pad; i++) {
        padding += PADDING
      }
      formatted += padding + item + '\r\n'
      pad += indent
    })
    // 返回的数据需要去除两边的空格
    return formatted.trim()
  }

}
