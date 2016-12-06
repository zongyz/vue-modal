<template>
	<div class="modal-window">
		<button class="modal-window-close" v-show="options.closeButton"  @click="close()"></button>
		<div class="modal-window-title" v-show="options.title" ref="drag" v-text="options.title"></div>
		<div class="modal-window-content" ref="mount">
		</div>
		<!-- <div class="modal-window-footer"></div> -->
	</div>
</template>


<script>
	export default {
		props : ['options'],
		methods : {
			close(){
				this.$emit('close')
			}
		}
    }
</script>


<style lang="scss">
.modal-window{
	background: #fff;
	border-radius:3px;
    margin-bottom:32px;
	box-shadow:0px 2px 4px rgba(0,0,0,.05), 0px 6px 40px rgba(0,0,0,.2);
	.modal-window-title{
        font-size:16px;
        padding:4px 0px;
        line-height:32px;
        border-bottom:1px solid #ddd;
        text-indent: 16px;
        font-weight: 400;
    }
    .modal-window-close{
        position:absolute;
        width:32px;
        height:32px;
        overflow: hidden;
        color:#888;
        background-color: transparent;
        border:0;
        text-align: center;
        right:8px;
        top:4px;
        padding:0px;
        cursor: pointer;
        text-shadow:0px 1px 0px #fff;
        transition: all .2s;
        outline:none;
        // background:rgba(255,0,0,.2);
        &:before{
            display: block;
            content:'\00D7';
            line-height: 24px;
            font-size:24px;
            margin:-4px 0 0;
            padding:0px 0px 0px 1px;
            
        }
        &:hover{
            color:#f66;
            transform: rotate(90deg);
        }
	}
    .modal-window-content{
        
    }
}
</style>