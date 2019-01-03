import EleMultiCascader from '@/components/Plugins/EleMultiCascader'

const MyPlugin = {}

MyPlugin.install = function(Vue) {
  Vue.component(EleMultiCascader.name, EleMultiCascader)
}

export default MyPlugin
