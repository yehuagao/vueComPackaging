<template>
	<div style="height:100%;width:100%">
		
		<videoComponent videoUrl="./src/assets/video/oceans.mp4"/>
	</div>
	
</template>

<script>
	import { Toast, Button, Swipe, SwipeItem } from 'mint-ui';
	import videoComponent from '../video/video.vue';
	export default{
		components:{
			videoComponent
		},
		data(){
			return {

			}
		},
		methods:{

		},
		mounted(){
		}
	}
</script>

<style lang="scss">
	
</style>	