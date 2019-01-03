/**
 * utils
 */

// 设置主题
export function setTheme(theme, url) {
  const body = document.body
  const styleName = theme + '-theme-style'
  if (!document.getElementById(styleName)) {
    const head = document.getElementsByTagName('HEAD').item(0)
    const style = document.createElement('link')
    style.href = `${url}/assets/theme/${theme}-theme/index.css`
    style.rel = 'stylesheet'
    style.type = 'text/css'
    style.id = styleName
    head.appendChild(style)
  }
  body.removeAttribute('style')
  body.classList.add(theme + '-theme')
}

// 格式化时间
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || 'y-m-d h:i:s'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/(y|m|d|h|i|s|a)/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 字符串首字母大写
export const strFirstUpper = str =>
  str.toLowerCase().replace(/( |^)[a-z]/g, first => first.toUpperCase())

// 切换样式
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

/**
 * 处理最后一项为空的情况
 * @param dataList tree
 * @param type 处理的字段名
 *
 *  */
export function handleLastEmpty(dataList, type) {
  dataList.map(item => {
    if (item[type].length !== 0) {
      handleLastEmpty(item[type], type)
    } else {
      delete item.children
    }
  })
  return dataList
}

/**
 * 根据ID返回层级
 * @param location Array
 * @param targetId  Number
 * @return Array
 */
export function id2Level(tree, id, childName = 'children') {
  const level = []
  ;(function id2Level(data, id, parent) {
    Array.isArray(data) &&
      data.forEach((item, index) => {
        if (item.id !== id) {
          item[childName] && id2Level(item[childName], id, [data, index])
        } else {
          parent && id2Level(tree, parent[0][parent[1]].id)
          level.push(item.id)
        }
      })
  })(tree, id)
  return level
}

// 金额转大写 只支持2位小数
export function number2CHN(num) {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(num)) return '请输入正确的金额'
  if (+num === 0) return '零'
  let unit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  let str = ''
  num += '00'
  const point = num.indexOf('.')
  if (point >= 0) {
    num = num.substring(0, point) + num.substr(point + 1, 2)
  }
  unit = unit.substr(unit.length - num.length)
  for (let i = 0; i < num.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(num.charAt(i)) + unit.charAt(i)
  }
  return str
    .replace(/零(仟|佰|拾|角)/g, '零')
    .replace(/(零)+/g, '零')
    .replace(/零(万|亿|元)/g, '$1')
    .replace(/(亿)万|(拾)/g, '$1$2')
    .replace(/^元零?|零分/g, '')
    .replace(/元$/g, '元整')
}

// 导出excel
export function exportExcel(data, title) {
  if (!data) return
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute(
    'download',
    title + parseTime(new Date().getTime()) + '.xlsx'
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
