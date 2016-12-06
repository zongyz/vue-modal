import Container from './Container'
import Overlay from './Overlay'
import Modal from './Modal'
import Window from './Window'
import Dialog from './Dialog'

export default {
    install: (Vue, args = {}) => { //插件安装方法

        const MODAL_PROPNAME = 'modal' //MODAL_PROPNAME是modal配置数据的属性名，如果属性名有冲突，可以修改配置，如果不希望modal的配置数据被Vue实例代理，可以选择定义一个_或$开头的属性名，这样就需要通过vm.$data._property来访问，本插件内部的所有配置均使用vm.$data访问
        const MODAL_REF_NAME = 'mount' //模型挂载点名称

        const CONTAINER_DEFAULT_CONFIG = { //容器默认配置
            el: '', //默认挂载点，默认自动创建一个div
            mount: document.body, //默认插入点，默认会插入到body
            mask: true,
            bgcolor: 'rgba(0, 0, 0, .7)'
        }
        const MODAL_DEFAULT_CONFIG = { //modal默认配置
            BASE: { //基础类型默认选项，其他类型均继承于此
                // type: Modal, //可以通过type参数自定义类型
                width: 480,
                visible: true,
                className: '',
                onClose(promise){ //关闭按钮拦截器，自定义关闭处理方式，如果返回false，可以阻止窗口关闭
                    return true
                }
            },
            WINDOW: { //窗口类型默认选项，继承BASE选项
                // type: Window, //使用Window类型
                width: 640,
                title: '', //window标题
                closeButton: true //是否显示关闭按钮
            },
            DIALOG: {
                width : 480,
                content : '',
                // icon : '', // 预留, dialog应该提供一些可选的默认图标
                buttonAlign : 'center',
                buttons: []
            },
            DIALOG_BUTTON: {
                text: '',
                className: '',
                close : true,
                event : '',
                action() {}
            },
            CONFIRM: {
                width : 320,
                yes : {
                    text : 'YES',
                    event : 'yes'
                },
                no : {
                    text : 'NO',
                    event : 'no',
                    className : 'btn-outline'
                }
            },
            ALERT: {
                width : 320,
                ok : {
                    text : 'OK',
                    event : 'ok'
                }
            },
            MESSAGE: {
                width : 480,
            }
        }


        Object.assign(CONTAINER_DEFAULT_CONFIG, args.options ? args.options : {})

        Object.assign(MODAL_DEFAULT_CONFIG, args.default ? args.default : {}) //TODO: 浅拷贝,需处理

        let $modalContainer = (conf) => { //创建容器

            let config = Object.assign({}, CONTAINER_DEFAULT_CONFIG, conf), //合并配置
                el = document.createElement('div'), //创建容器挂载点
                mount = document.body //定义默认插入点

            //TODO: 应该对插入点和挂载点做判断，如果节点不存在使用默认
            

            mount.appendChild(el) //插入容器挂载点

            return new Vue({ //创建容器实例
                el: el,
                components: {
                    Container, //容器组件
                    Overlay //overlay组件
                },
                data() {
                    return {
                        config, //容器配置
                        modals: [] //modal组
                    }
                },
                methods: {
                    base(modal, options = {}, type = Modal) { //基础类型，提供最小功能，方便自由定制
                        let container = this,
                            modals = container.modals, //modal组指针
                            mixins = { //通过混合定义modal的基本配置和默认方法
                                data() {
                                    let _this = this
                                    return { //合并modal默认配置
                                        [MODAL_PROPNAME]: Object.assign(
                                            {}, 
                                            MODAL_DEFAULT_CONFIG.BASE, 
                                            options,
                                            { //提供modal方法
                                                options(set, value) { //更新配置
                                                    Object.assign(this, typeof set == 'string' ? {[set] : value} : set)
                                                },
                                                hide() { //隐藏modal
                                                    this.visible = false
                                                },
                                                show() { //显示被隐藏的modal
                                                    this.visible = true
                                                },
                                                close(intercept) { //关闭(销毁)modal
                                                    _this.$emit('close', intercept)
                                                }
                                            }
                                        )
                                    }
                                },
                                methods : {
                                    $close(intercept){
                                        this.$data[MODAL_PROPNAME].close(intercept)
                                    }
                                }
                            },
                            instance = Vue.extend(modal), //生成组件
                            $instance = new instance({ //实例化组件
                                mixins: [mixins]
                            }),
                            $modal = {
                                type,
                                instance: $instance.$mount(), //空挂载后加入modal组，待合适时机挂载
                                position: {
                                    x: modals.length * 40 + 40,
                                    y: modals.length * 40 + 40,
                                    zIndex: modals.length ? modals.slice(0).sort((a, b) => a.position.zIndex - b.position.zIndex).pop().position.zIndex + 1 : 1, //取modal组中最后一个modal的zindex+1
                                },
                                drag(e) {
                                    let offset = {
                                            x: e.clientX - $modal.position.x,
                                            y: e.clientY - $modal.position.y
                                        },
                                        move = (e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            $modal.position.x = e.clientX - offset.x
                                            $modal.position.y = e.clientY - offset.y
                                        },
                                        off = (e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            document.removeEventListener('mousemove', move)
                                            document.removeEventListener('mouseup', off)
                                            e.target.style.userSelect = 'all'
                                        }
                                    document.addEventListener('mousemove', move)
                                    document.addEventListener('mouseup', off)
                                    e.target.style.userSelect = 'none'
                                }
                            }
                        $instance.$on('close', (intercept) => { //响应关闭事件
                            (new Promise(function(resolve, reject){ //创建一个promise控制关闭
                                if($modal.instance.$data[MODAL_PROPNAME].onClose({resolve, reject}) || intercept) resolve() //判断拦截器是否阻止了关闭操作
                            })).then(function(){
                                container.$nextTick(() => { //使用nextTick确保每次Dom变更后再进行下一次的数据操作
                                    $modal.instance.$destroy()
                                    modals.splice(modals.indexOf($modal), 1) //移出modal组 //TODO: 关闭后应该重建zIndex索引
                                    $instance.$emit('closed')
                                })
                            }).catch(()=>{
                                $instance.$emit('closefailed')
                            })
                        })
                        $instance.$on('front', () => { //响应置顶事件
                            let max = modals.slice(0).sort(({
                                    position: a
                                }, {
                                    position: b
                                }) => a.zIndex - b.zIndex).pop().position.zIndex //取最顶层zIndex
                            modals.map(({
                                position: v
                            }) => { //重建zIndex
                                if (v.zIndex > $modal.position.zIndex) v.zIndex--
                            })
                            $modal.position.zIndex = max
                        })
                        modals.push($modal)
                        return $instance //返回组件实例
                    },
                    window(modal, options = {}) { //窗口类型，有标题和关闭按钮
                        return this.base(modal, Object.assign({}, MODAL_DEFAULT_CONFIG.WINDOW, options), Window)
                    },
                    dialog(options) { //对话框类型，有标题按钮回调
                        options.buttons && options.buttons.map( (btn, i) => options.buttons[i] = Object.assign({}, MODAL_DEFAULT_CONFIG.DIALOG_BUTTON, btn) )
                        let $dialog = this.window(Dialog, Object.assign({}, MODAL_DEFAULT_CONFIG.DIALOG, options))
                        $dialog.$on('action', (btn)=>{
                            if(typeof btn.action == 'function') btn.action()
                            if(btn.close) $dialog.$emit('close')
                            if(btn.event) $dialog.$emit(btn.event, btn)
                        })
                        options.buttons && options.buttons.map( btn =>{ if(btn.event) $dialog[btn.event] = func => $dialog.$on(btn.event, func) })
                        return $dialog
                    },
                    confirm(arg, title) {
                        let options = {}
                        if(typeof title == 'string') options.title = title
                        typeof arg == 'string' ?  options.content = arg : Object.assign(options, arg)
                        options.buttons = [
                            Object.assign({}, MODAL_DEFAULT_CONFIG.CONFIRM.yes, arg.yes || {}),
                            Object.assign({}, MODAL_DEFAULT_CONFIG.CONFIRM.no, arg.no || {})
                        ]
                        return this.dialog(Object.assign({}, MODAL_DEFAULT_CONFIG.CONFIRM, options))
                    },
                    alert(arg, title) {
                        let options = {}
                        if(typeof title == 'string') options.title = title
                        typeof arg == 'string' ?  options.content = arg : Object.assign(options, arg)
                        options.buttons = [ Object.assign({}, MODAL_DEFAULT_CONFIG.ALERT.ok, arg.ok || {}) ]
                        return this.dialog(Object.assign({}, MODAL_DEFAULT_CONFIG.ALERT, options))
                    },
                    message(content, title) {
                        let options = {content, title}
                        return this.dialog(Object.assign({}, MODAL_DEFAULT_CONFIG.MESSAGE, options))
                    },
                    _close(instance) { //关闭
                        instance.$emit('close')
                    },
                    _front(instance) { //提至顶端
                        instance.$emit('front')
                    }
                },
                computed: {
                    isShow() { //如果modal组为空，销毁容器节点
                        return this.modals.length
                    },
                    isVisible() { //如果可见modal为空，隐藏容器节点
                        let count = this.modals.filter(item => item.instance.$data[MODAL_PROPNAME].visible).length
                            // TODO:容器显示时，设置插入点的overflow:hidden
                        return count
                    }
                },
                watch: {
                    modals(val, oldVal) {} //
                },
                template: (`
					<Container v-if="isShow" v-show="isVisible">
						<Overlay
							v-show="config.mask"
							:style="{
								zIndex : 0,
                                backgroundColor : config.bgcolor
							}"
						></Overlay>
						<component 
							v-for="(modal, id) in modals"
							v-show="modal.instance.$data.` + MODAL_PROPNAME + `.visible"
							v-modal-mount="modal.instance"
							v-modal-drag="modal.drag"
							:is="modal.type"
							:options="modal.instance.$data.` + MODAL_PROPNAME + `"
							:class="modal.instance.$data.` + MODAL_PROPNAME + `.className"
							:style="{
								zIndex : modal.position.zIndex,
								position : 'absolute',
								left : '50%',
								width: modal.instance.$data.` + MODAL_PROPNAME + `.width + 'px',
								height : 'auto',
								top : modal.position.y + 'px',
								marginLeft : -modal.instance.$data.` + MODAL_PROPNAME + `.width / 2 + modal.position.x + 'px'
							}"
							@close="_close(modal.instance)"
							@mousedown.native="_front(modal.instance)"
						>
						</component>
					</Container>
				`),
                directives: {
                    modalMount(el, binding, vnode) {
                        if (vnode.child.$refs[MODAL_REF_NAME].children.length) {
                            vnode.child.$refs[MODAL_REF_NAME].replaceChild(binding.value.$el, vnode.child.$refs[MODAL_REF_NAME].children[0])
                        } else {
                            vnode.child.$refs[MODAL_REF_NAME].appendChild(binding.value.$el)
                        }
                    },
                    modalDrag: {
                        bind(el, binding, vnode) {
                            vnode.child.$refs.drag.addEventListener('mousedown', binding.value)
                        },
                        update(el, binding, vnode) {
                            if (binding.oldValue != binding.value) {
                                vnode.child.$refs.drag.removeEventListener('mousedown', binding.oldValue)
                                vnode.child.$refs.drag.addEventListener('mousedown', binding.value)
                            }
                        }
                    },
                    modalResize: {

                    }
                },
                created(){
                    let bodyOverflow = document.body.style.overflow
                    this.$watch('isVisible', (val)=>{
                        if(val){
                            bodyOverflow = document.body.style.overflow
                            document.body.style.overflow = 'hidden'
                        }else{
                            document.body.style.overflow = bodyOverflow
                        }
                    })
                }
            })
        }

        Vue.prototype.$modal = (c) => new $modalContainer(c)
        Vue.prototype.$confirm = (arg, title) => (new $modalContainer()).confirm(arg, title)
        Vue.prototype.$alert = (arg, title) => (new $modalContainer()).modal.alert(arg, title)
        Vue.prototype.$message = (content, title) => (new $modalContainer()).message(content, title)
    }
}


/*

	modal是页面交互的重要组件，可以提供多一个维度的交互操作，一个好的modal组件可以改进页面交互体验，提高开发效率

*/