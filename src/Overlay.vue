<template>
	<div class="modal-overlay">
		<slot></slot>
	</div>
</template>

<script>
export default {
}
</script>

<style>
.modal-overlay{
	position : fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	background-color: rgba(255,255,255,.86);
}
</style>