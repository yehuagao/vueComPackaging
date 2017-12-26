<template>
	<div style="height:100%;width:100%;">
		<div class="video-box" @touchstart.stop.prevent="showHidechange()" ref="videoBox">
			<video :src="videoUrl" id="myVideo" width="100%" height="200px" ref="videoRef" poster @timeupdate="timeupdate($event)" x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
			<i class="fa fa-chevron-left" aria-hidden="true" v-show="isShow" ref="quitFullScreen" @touchstart.stop.prevent="quitFullScreen"></i>
			<div :class="'video-btn-box ' + btnBoxAnimate" ref="btnBox" v-show="isShow">
				<i :class="'fa play-pause-btn ' + btnIcon" aria-hidden="true" ref="btnPlayPause" @touchstart.stop.prevent="playPauseChange"></i>
				<p class="progress-bar" ref="progressBar">
					<span class="progress-bg" ref="progressBg"></span>
					<span class="progress-point" @touchmove="moveProgress($event)" ref="progressPoint">
						<span class="progresstime">{{progresstime/60 > 1 ? (progresstime/60).toFixed(2) + 'm' : progresstime.toFixed(2) + 's'}}</span>
					</span>
				</p>
				<span class="totalTime">{{duration/60 > 1 ? (duration/60).toFixed(2) + 'm' : duration.toFixed(2) + 's'}}</span>
				<i class="fa fa-arrows-alt" aria-hidden="true" @touchstart.prevent.stop="expand()"></i>
			</div>
			<p class="slideBox" ref="slideBox" v-show="isDrag">
				<i :class="forBtn" aria-hidden="true"></i>
				<span>{{slideTime/60 > 1 ? (slideTime/60).toFixed(2) + 'm' : slideTime.toFixed(2) + 's'}}</span>
			</p>
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
				progresstime: 0,
				slideTime: 0,
				forBtn: 'fa fa-forward'
			}
		},
		methods:{
			delayHide() {
				setTimeout(() => {
					this.isShow = false;
				}, 500);
			},
			playPauseChange() {
				if(this.btnIcon == 'fa-play'){
					//切换为暂停按钮，开始播放
					this.$refs.videoRef.play();
					this.btnIcon = 'fa-pause';
					this.btnBoxAnimate = 'movedown';
					this.delayHide();
				}else{
					this.$refs.videoRef.pause();
					this.btnIcon = 'fa-play';
					this.isShow = true;
				}
			},
			showHidechange() {
				if(this.isShow){
					this.btnBoxAnimate = 'movedown';
					this.delayHide();
				}else{
					this.isShow = true;
					this.btnBoxAnimate = 'moveup';
				}
			},
			positionTime(arg, time, position) {
				if(arg == -1){
					this.$refs.progressBg.style.width = position + 'px';//拖动条位置
					this.$refs.progressPoint.style.left = position + 'px';
				}else{
					this.$refs.videoRef.currentTime = time;//视频当前时间
					this.$refs.progressBg.style.width = position + 'px';//拖动条位置
					this.$refs.progressPoint.style.left = position + 'px';
				}
			},
			//拉动进度条
			moveProgress(event) {
				this.isDrag = true;
				let progressBar = this.$refs.progressBar;
				let proWidth = progressBar.offsetWidth;
				let active = event.target;
				let proLength = event.touches[0].clientX - progressBar.offsetLeft;
				let time = (parseInt(active.style.left) / proWidth) * this.duration;
				this.progresstime = time;
				if(proLength <= 0){
					this.positionTime(0, 0, 0);
				}else if(proLength >= proWidth){
					this.positionTime(0, time, proWidth - active.offsetWidth);
				}else{
					this.positionTime(0, time, proLength);
				}
				this.isDrag = false;
			},
			//视频位置改变
			timeupdate() {
				let activeTime = this.$refs.videoRef.currentTime;
				this.progresstime = this.$refs.videoRef.currentTime;
				//计算得出移动的长度
				let moveLen = activeTime / this.duration * this.$refs.progressBar.offsetWidth;
				this.positionTime(-1, 0, moveLen);
				this.isDrag = false;
			},
			//全屏
			expand() {
				
				var that = this;
				document.addEventListener( "plusready", onPlusReady(), false );
				function onPlusReady(){
					try{
						plus.navigator.setFullscreen(true);
						videoContainer(that.$refs.videoBox).webkitRequestFullscreen();
					}catch(error){
						console.log(error)
					}
					var conW = window.screen.width;
				    var conH = window.screen.height;  
				
				    that.$refs.videoBox.style.transformOrigin = "center center";
				    that.$refs.videoBox.style.transform = "rotate(90deg) translate("+((conH-conW)/2)+"px,"+((conH-conW)/2)+"px)";
				    that.$refs.videoBox.style.width = conH + "px";
				    that.$refs.videoBox.style.height = conW + "px";
				    that.$refs.videoRef.style.width = conH  + "px";
				    
				}
			},
			//退出全屏
			quitFullScreen() {
				try{
					document.webkitCancelFullScreen();
				}catch(error){
					console.log(error)
				}
				var conW = window.screen.width;
				var conH = window.screen.height;  
				this.$refs.videoBox.style.transformOrigin =  "center center";
			    this.$refs.videoBox.style.transform = "rotate(0deg)";
			    this.$refs.videoBox.style.width = "100%";
			    this.$refs.videoBox.style.height = "200px";
			    this.$refs.videoRef.style.width = "100%";
			},
			//滑动快进/倒退
			slideTo() {
				let startX, startY;
				this.$refs.videoBox.addEventListener("touchstart", function(e) {
					e.preventDefault();
					e.stopPropagation();
					startX = e.touches[0].pageX;
					startY = e.touches[0].pageY;
				});
				this.$refs.videoBox.addEventListener("touchmove", e => {
					//this.isShow = false;
				 	e.preventDefault();
				 	e.stopPropagation();
				 	let moveEndX = e.touches[0].pageX;
				 	let moveEndY = e.touches[0].pageY;
				 	let X = moveEndX - startX;
				 	let Y = moveEndY - startY;
				 	X = X/10;
				 	if(X > 0){
				 		this.forBtn = 'fa fa-forward';
				 	}else{
				 		this.forBtn = 'fa fa-backward';
				 	}
					this.isDrag = true;
					let progressBar = this.$refs.progressBar;
					let proWidth = progressBar.offsetWidth;
					this.$refs.progressPoint.style.left = this.$refs.progressPoint.offsetLeft + X + 'px';
					let active = this.$refs.progressPoint;
					let time;
					if(this.$refs.progressPoint.offsetLeft <= 0){
						time = 0;
					}else{
						time = Number((parseInt(this.$refs.progressPoint.offsetLeft) / proWidth) * this.duration);
					}
					if(time <= 0){
						this.progresstime = 0;
					}else{
						this.progresstime = time;
						this.slideTime = time;
					}
					
					this.$refs.videoRef.currentTime = time;//视频当前时间
					this.$refs.progressBg.style.width = this.$refs.progressPoint.offsetLeft + X + 'px';//拖动条位置
					this.$refs.progressPoint.style.left = this.$refs.progressPoint.offsetLeft + X + 'px';

				});

			}
		},
		mounted() {
			//console.log('设备屏幕状态',window.orientation)
			//console.log(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight)
			const that = this;
			//监听视频播放进度
			let videoEl = this.$refs.videoRef;
			videoEl.addEventListener("canplay", function(){
				that.duration = this.duration;
			})
			//视频结束
			videoEl.addEventListener("ended", event =>{
				that.isDrag = false;
				that.btnIcon = 'fa-play';
				this.positionTime(0, 0, 0);
			})

			this.slideTo();

			
		}
	}
</script>

<style lang="scss">
	.movedown{
		animation: movedown 0.5s;
	}
	.moveup{
		animation: moveup 0.5s;
	}
	@keyframes movedown{
		from {bottom:0; opacity:1}
		to {bottom: -50px; opacity:0}
	}
	@keyframes moveup{
		from {bottom:-50px; opacity:0}
		to {bottom: 0; opacity:1}
	}
	.fa-chevron-left{
		display:inline-block;width:20px;height:20px;text-align:center;line-height:20px;
			position:absolute;top:10px;left:10px;
	}
	.slideBox{
		position:absolute;
		left:45%;
		top:50%;color:rgba(255,255,255,.4);
		span{
			display:block;color:rgba(255,255,255,.9);
			font-size:5px;
		}
	}

	@media screen and (orientation: portrait) {
	   .video-box{
		width:100%;
		height:200px;
		position:absolute;
		background:#000;overflow:hidden;
		video{
			width:100%;
			height:auto;
			background:#000;
			overflow:hidden;
			position:absolute;
			top:0;bottom:0;
			left:0;right:0;
			margin:auto;
		}
		.video-btn-box{
			display:flex;align-items:center;
			position:absolute;
			bottom:0;left:0;
			width:100%;
			height:50px;background:rgba(252,252,252,.2);
			overflow:hidden;z-index:99999;
			.play-pause-btn{margin-left:20px;}
			.progress-bar{width:80%;height:1px;border:1px solid #ccc;margin-left:5px;position:relative;border-left:1px solid #4090EA;
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
			.totalTime{
				color:rgba(255,255,255,.6);font-size:3px;
				position:absolute;right:10%;
				top:30px;
			}
			.fa-arrows-alt{
				position:absolute;right:5px;
				color:rgba(255,255,255,.4);
				font-size:20px;
			}

		}
		i{color:#fff}
	}
	} 
	@media screen and (orientation: landscape) {
	    .video-box{
		width:100%;height:100%;
		position:absolute;
		background:#000;
		video{
			width:100%;height:100%;
			background:#000;
			overflow:hidden;
			position:absolute;
			left:0;top:0;
		}
		.video-btn-box{
			display:flex;align-items:center;
			position:absolute;
			bottom:0;left:0;
			width:100%;
			height:50px;background:rgba(252,252,252,.2);
			overflow:hidden;z-index:99999;
			.play-pause-btn{margin-left:20px;}
			.progress-bar{width:80%;height:1px;border:1px solid #ccc;margin-left:5px;position:relative;border-left:1px solid #4090EA;
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
			.totalTime{
				color:rgba(255,255,255,.6);font-size:3px;
				position:absolute;right:10%;
				top:30px;
			}
			.fa-arrows-alt{
				position:absolute;right:5px;
				color:rgba(255,255,255,.4);
				font-size:20px;
			}
		}
		.fa-chevron-left{
			display:inline-block;width:20px;height:20px;text-align:center;line-height:20px;
				position:absolute;top:10px;left:10px;

			}
		i{color:#fff}
	}
	}

</style>	