<template>
	<div>
		<div class="swipeBox">
			<mt-swipe :show-indicators="false" @change="handleChange" :auto="autoPlay">
			  	<mt-swipe-item v-for="(item, idx) in swipeData" :key="idx">{{item}}</mt-swipe-item>	
			</mt-swipe>
			<div class="showpage" v-show="showPage"><span>{{curPage}}</span>/<span>{{this.swipeData.length}}</span></div>
		</div>
		
	</div>
	
</template>

<script>
	import { Swipe, SwipeItem } from 'mint-ui';
	//组件使用props
	//autoPlay=0为不自动(单位毫秒)，
	//swipe为轮播图片
	//showPage是否显示轮播页码,false为不显示
	export default{
 		data:function(){
 			return{
 				curPage:1,
 			}
 		},
 		props:['showPage','swipeData','autoPlay'],
 		methods:{
 			 handleChange(index){
 			 	this.curPage = index + 1;
 			 }
 		}
 	}
</script>

 <style lang="scss">
 	.showpage{position:absolute;z-index:200;right:0.5333rem;bottom:0.2667rem;background:#7F7F7F;color:#FFF;height:0.6rem;width:1.1467rem;display:flex;
 		justify-content:center;align-items:center;border-radius:0.1333rem;margin-bottom:0.3333rem;
 		span{margin:0 0.16rem}}
 	.swipeBox{position:relative;border-bottom:0.0133rem solid #E1E1E1;}
	.swipeBox,.mint-swipe-items-wrap,.mint-swipe-item{
		height:10.0rem;
	}
 </style>