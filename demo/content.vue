<template>
	<div class="demo-content">
		demo-content
		<div v-if="timeout">
			close intercept (timeout:<span style="color:red">{{timeout}}</span>)
		</div>
	</div>
</template>


<script>
export default {
	data(){
		return {
			timeout : 0
		}
	},
	mounted(){
		let _this = this
		this.modal.options({
			onClose(p){
				_this.timeout = 5
				_this.modal.options('closeButton',false)
				let timer = setInterval(()=>{
					_this.timeout--
					if(_this.timeout < 1){
						clearInterval(timer)
						// p.resolve()
						_this.$close(true)
					}
				},1000)
				return false
			}
		})
	},
	beforeDestroy(){
	    console.log('on content destroy')
    }
}	
</script>

<style lang="scss">
	.demo-content{
		padding:16px;
	}
</style>