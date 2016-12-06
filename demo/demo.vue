<template>
    <div class="demopage" ref="demobox">
        <h3>setting:</h3>
        <p>
            <label>
                test height:
                <select v-model="config.height">
                    <option value="320">320px</option>
                    <option value="640">640px</option>
                    <option value="1200">1200px</option>
                </select>
            </label>
        </p>
        <p>
            <label>
                background:
                <select v-model="config.pagebg">
                    <option value="#ffffff">white</option>
                    <option value="#000000">black</option>
                    <option value="#0000ff">blue</option>
                    <option value="#ff0000">red</option>
                </select>
            </label>
        </p>
        <h3>demo:</h3>
        <p>
            <strong>window:</strong>
            <button @click="testWindow()">open window</button>
        </p>
        <p>
            <strong>dialog:</strong>
            <button @click="testDialog()">open dialog</button>
        </p>
        <p>
            <strong>confirm:</strong>
            <button @click="testConfirm()">open confirm</button>
            <button @click="testConfirmSimple()">open confirm simple</button>
        </p>
        <p>
            <strong>alert:</strong>
            <button @click="testAlert()">open alert</button>
        </p>
        <p>
            <strong>message:</strong>
            <button @click="testMessage()">open message</button>
        </p>
    </div>
</template>

<script>
import Content from './content'

export default {
    data(){
        return {
            config : {
                height : 320,
                pagebg : '#ffffff',
                overlaybg : 'rgba(0,0,0, .8)'
            }
        }
    },
    methods : {
        testWindow(){
            this.$modal().window(Content, {
                title : 'Demo title'
            })
        },
        testDialog(){
            this.$modal().dialog({
                title : 'Rate me',
                content : 'Thank you for using My App, if you\'re loving(or even hating) it, an honest rating would really help us out. Thanks!',
                closeButton : false,
                buttons : [
                    {
                        text: 'Rate Now',
                        event : 'rate'
                    },
                    {
                        text : 'Maybe Later',
                        className : 'btn-success'
                    },
                    {
                        text : 'No Thanks',
                        className : 'btn-outline',
                        close : true,
                        action(){
                            console.log('close action')
                        }
                    }
                ]
            }).rate(()=>console.log('rate'))
        },
        testConfirm(){
            this.$modal().confirm({
                title : 'please confirm',
                content : 'Open the pandora\'s box?',
                no : {
                    text : 'Cancel'
                }
            })
        },
        testConfirmSimple(){
            this.$confirm('Open the simple pandora\'s box?', 'title')
                .yes(()=>console.log('yes'))
                .no(()=>console.log('no'))
        },
        testAlert(){
            this.$modal()
                .alert('major completed')
                .ok(()=>console.log('ok'))
        },
        testMessage(){
            this.$modal().message('hello world', 'message')
        }
    },
    mounted(){
        this.$watch('config', val=>{
            this.$refs.demobox.style.minHeight = val.height + 'px'
            document.body.style.backgroundColor = val.pagebg
        }, {
            deep : true,
            immediate: true
        })
    }
}
</script>

<style lang="scss" scoped>
    body *{
        padding:0px;
        margin:0px;
        box-sizing:border-box;
    }
    .demopage{        
        float:left;
        font:14px/1.5 Verdana;
        padding:24px;
        border:2px dotted #999;
        background-color: #fff;
        h3{
            font-size:16px;
            margin:16px 0 8px;
        }
        p{
            padding:8px 0;
        }
        input{
            height:32px;
            border-width:1px;
            border-style:solid;
            border-color:#aaa;
            background:#fff;
            padding:8px 0;
            text-indent:8px;
        }
        button{
            height:32px;
            border:0;
            color:#fff;
            background:#09f;
            padding:8px 16px;
        }
    }
</style>