<template>
	<div class="modal-container">
		<slot></slot>
	</div>
</template>


<script>
	
</script>

<style>
	.modal-container{
		z-index: 99999;
		position : fixed;
		overflow-y: auto;
		overflow-x: hidden;
		top:0;
		left:0;
		right:0;
		bottom:0;
		font:14px/1.8 Verdana;
	}
</style>