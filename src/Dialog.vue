<template>
	<div class="modal-dialog">
		<div 
			class="modal-dialog-content" 
			v-html="$data.modal.content"
			:style="{paddingRight : $data.modal.closeButton && !$data.modal.title ? '48px' : '16px'}"
		></div>
		<div class="modal-dialog-footer" :style="{textAlign:$data.modal.buttonAlign}" v-show="$data.modal.buttons.length">
			<button
				v-for="btn in $data.modal.buttons"
				v-text="btn.text"
				:class="btn.className" class="btn"
				@click="onClick($event, btn)"
			></button>
		</div>
	</div>
</template>

<script>
export default {
	methods : {
		onClick(e, btn){
			this.$emit('action', btn)
		}
	}
}
</script>

<style lang="scss">


.modal-dialog-content{
	padding:16px;
}
.modal-dialog-footer{
	border-top:1px solid #eee;
	padding:16px;
	.btn + .btn{
		margin-left:16px;
	}
}



$borderRadius : 2px;

$borderColor : #4E9BED;
$bgColor : $borderColor;  // $bgColor : transparent;
$textColor : #FFF;
$hoverTextColor : $textColor;
$hoverBorderColor : $borderColor;
$hoverBgColor : $bgColor;
$baseHeight : 40px;

@mixin buttonColor(
  $color,
  $bgColor,
  $hoverBgColor
){
  color : $color;
  background-color:$bgColor;
  border-color:$bgColor;
  &:hover{
    color:$color;
    background-color:$hoverBgColor;
    border-color:$hoverBgColor;
  }
  &.btn-outline{
    color:$bgColor;
    background:none;
    &:hover{
      color:$hoverBgColor;
    }
  }
  &.btn-noline{
    color:$bgColor;
    background:transparent;
    border-color:transparent;
    &:hover{
      color:$hoverBgColor;
    }
  }
}

.modal-dialog {
	.btn{
	  line-height:($baseHeight)-2;
	  letter-spacing:2px;
	  padding:0px 24px;
	  display:inline-block;
	  border-radius:$borderRadius;
	  border-style:solid;
	  border-width:1px;
	  text-decoration:none;
	  text-align:center;
	  cursor:pointer;
	  outline:none;
	  vertical-align: middle;
	  &:hover{
	    text-decoration:none;
	  }
	  &.btn-outline{
	  }
	  &.btn-noline{
	    padding:0px 12px;
	  }
	}

	.btn{
	  @include buttonColor(#fff, #6A8BB2, #5A7AA0);
	  &.btn-warning{
	    @include buttonColor(#fff, #DE9A82, #D48D77);
	  }
	  &.btn-success{
	    @include buttonColor(#fff, #80AE76, #6C9A61);
	  }
	  &.btn-disabled, &[disabled]{
	    cursor:not-allowed;
	    @include buttonColor(#888, #ccc, #ccc);
	    text-shadow:1px 1px 0px #eee;
	  }

	  &.btn-fill{
	    width:100%;
	  }
	  &.btn-narrow{
	    letter-spacing: 0px;
	    padding-left: 12px;
	    padding-right: 12px;
	  }
	  &.btn-wide{
	    padding-left:48px;
	    padding-right:48px;
	  }

	  &.btn-small{
	    line-height:22px;
	    font-size:12px;
	    padding:0px 12px;
	  }
	}
}

</style>