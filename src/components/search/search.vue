<template>
	<div class="searbody-bg">
		<div class="searbg">
			<div class="searinput">
				<div class="searleft">
					<span class="sear-btn"></span>
					<input type="text" placeholder="搜索...">
				</div>
				<span class="cancel-sear"></span>
			</div>
			<ul>
				<li v-for="item in showlist">{{item.name}}<span>{{item.num}}</span></li>
			</ul>
		</div>
		
	</div>
	
</template>

<script>
	export default{
		data:function(){
			return{
				showlist:[{name:"苹果",num:"5斤"},{name:"雪梨",num:"3斤"},{name:"凤梨",num:""}]
			}
		},
		mounted:function(){
			//获取当前窗口的高
			var curHeight = window.innerHeight;
			document.querySelector('.searbody-bg').style.height = curHeight / 75 + 'rem';
		}
	}
</script>


<style lang="scss">
	
</style>