<template>
	<div>
		<div class="video-box" @click.stop="showHidechange">
			<video :src="videoUrl" width="100%" height="200px" ref="videoRef" poster @timeupdate="timeupdate($event)"></video>
			<div :class="'video-btn-box ' + btnBoxAnimate" ref="btnBox" v-show="isShow">
				<i :class="'fa play-pause-btn ' + btnIcon" aria-hidden="true" ref="btnPlayPause" @click.stop="playPauseChange"></i>
				<p class="progress-bar" ref="progressBar">
					<span class="progress-bg" ref="progressBg"></span>
					<span class="progress-point" @touchmove="moveProgress($event)" ref="progressPoint">
						<span class="progresstime">{{progresstime}}</span>
					</span>
				</p>
				<span style="color:#fff;font-size:3px">{{duration/60 > 1 ? duration/60 + 'm' : duration + 's'}}</span>
			</div>
		</div>
		
	</div>
	
</template>

<script>
	export default{
		components:{
		
		},
		props:['videoUrl'],
		data(){
			return {
				btnIcon: 'fa-play',
				isShow: true,
				btnBoxAnimate: '',
				duration: 0,
				isDrag: false,
				progresstime: 0
			}
		},
		methods:{
			delayHide(){
				setTimeout(() => {
					this.isShow = false;
				}, 1000);
			},
			playPauseChange() {
				if(this.btnIcon == 'fa-play'){
					//切换为暂停按钮，开始播放
					this.$refs.videoRef.play();
					this.btnIcon = 'fa-pause';
					this.btnBoxAnimate = 'movedown';
					this.delayHide();
				}else{
					this.btnIcon = 'fa-play';
					this.$refs.videoRef.pause();
					this.isShow = true;
				}
				//判断是否已到达尾
				if(this.$refs.videoRef.ended){
					this.$refs.videoRef.play();
				}
			},
			showHidechange(){
				if(this.isShow){
					this.btnBoxAnimate = 'movedown';
					this.delayHide();
				}else{
					this.isShow = true;
					this.btnBoxAnimate = 'moveup';
				}
			},
			//拉动进度条
			moveProgress(event){
				this.isDrag = true;
				let progressBar = this.$refs.progressBar;
				let proWidth = progressBar.offsetWidth;
				let active = event.target;
				let proLength = event.touches[0].clientX - progressBar.offsetLeft;
				if(proLength <= 0){
					active.style.left = 0 ;
					this.$refs.videoRef.currentTime = 0; 
					this.progresstime = 0;
				}else if(proLength >= proWidth){
					active.style.left = proWidth - active.offsetWidth + 'px';
					this.$refs.videoRef.currentTime = (parseInt(active.style.left) / proWidth) * this.duration;
					this.progresstime = this.$refs.videoRef.currentTime;
				}else{
					active.style.left = proLength + 'px';
					this.$refs.videoRef.currentTime = (parseInt(active.style.left) / proWidth) * this.duration;
					this.progresstime = this.$refs.videoRef.currentTime;
				}
				this.$refs.progressBg.style.width = active.style.left;
				this.isDrag = false;
				//设置拖动后的时间
			},
			//视频位置改变
			timeupdate(event){
				if(Math.round(event.timeStamp / 1000) > this.duration){
					event.timeStamp = Math.round(event.timeStamp/1000) % this.duration;
				}
				if(!this.isDrag){
					let activePercent = (Math.round(event.timeStamp) / 1000 / this.duration).toFixed(2);
					this.progresstime = Math.round(event.timeStamp /1000);
					//计算得出移动的长度
					let moveLen = (activePercent * this.$refs.progressBar.offsetWidth).toFixed(2);
					this.$refs.progressBg.style.width = moveLen + 'px';
					this.$refs.progressPoint.style.left = moveLen + 'px';
					this.isDrag = false;
				}
			}
		},
		mounted(){
			const that = this;
			//监听视频播放进度
			let videoEl = this.$refs.videoRef;
			videoEl.addEventListener("canplay", function(){
				that.duration = Math.round(this.duration + 2);
			})
			//视频结束
			videoEl.addEventListener("ended", function(event){
				that.isDrag = false;
				that.btnIcon = 'fa-play';
				that.$refs.progressPoint.style.left = 0;
				that.$refs.progressBg.style.width = 0;
				that.progresstime = 0;
			})
		}
	}
</script>

<style lang="scss">
	.video-box{
		width:100%;
		position:relative;
		background:#000;overflow:hidden;
		video{
			width:100%;
			background:#000;
		}
		.video-btn-box{
			display:flex;align-items:center;
			position:absolute;
			bottom:0;left:0;
			width:100%;
			height:50px;background:rgba(252,252,252,.2);
			overflow:hidden;
			.play-pause-btn{margin-left:20px;}
			.progress-bar{width:85%;height:1px;border:1px solid #ccc;margin-left:5px;position:relative;border-left:1px solid #4090EA;
				.progress-bg{display:inline-block;background:#4090EA;height:3px;
					position:absolute;left:0;margin-top:-1px;
				}
				.progress-point{
					position:absolute;
					left:0;top:0;
					margin-top:-5px;
					width:10px;height:10px;
					border-radius:50%;
					background:#4090EA;
				}
				.progresstime{position:absolute;
					left:10px;top:-15px;
					color:rgba(255,255,255,.4);
					font-size:5px;
					border:1px solid rgba(255,255,255,.4);
					border-radius:3px;
					padding:0 2px;
				}
			}
		}
		i{color:#fff}
	}
	.movedown{
		animation: movedown 1s;
	}
	.moveup{
		animation: moveup 1s;
	}
	@keyframes movedown{
		from {bottom:0; opacity:1}
		to {bottom: -50px; opacity:0}
	}
	@keyframes moveup{
		from {bottom:-50px; opacity:0}
		to {bottom: 0; opacity:1}
	}
	
</style>	