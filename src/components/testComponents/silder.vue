<template lang="html">
    <section class="silderbox">
        <div class="silderbox-img" ref="silderboxImg" v-bind="{'style' : 'width:'+ boxWidth +'px'}"
        v-on:touchstart.stop.prevent="touchstart($event)"
        v-on:touchmove.stop.prevent="touchmove($event)"
        v-on:touchend.stop.prevent="touchend($event)">

            <slot>
                <a v-bind:href="item.url" v-for="(item,idx) in imgs" v-bind="{'data-item' : idx}">
                    <img v-bind:src="item.src" v-bind:alt="item.alt">
                </a>
            </slot>

        </div>
        <ul class="silderbox-item" ref="silderboxItem">
            <li v-for="(i,idx) in imgs.length" v-bind:class="{'curr': idx==imgIndex}"></span>
        </ul>
    </section>
</template>

<script>
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    toString(){
        return this.x+'+'+this.y;
    }

    toColor(){
        return this.color;
    }
}
class ColorPoint extends Point{
    constructor(x,y,color){
        // this.color = color;
        super(x,y);
        this.color = color;
    }

}
// let p = new Point(1,2);
// console.log(p.toString());
// console.log(typeof Point);
// console.log(Point == Point.prototype.constructor);
// console.log(Object.getOwnPropertyNames(Point.prototype));

let cp = new ColorPoint(25,8,'green');
console.log(cp.toColor());


export default {
    name:'silderbox',
    data(){
        return {
            msg:'silder',
            imgs:this.imgArr,
            imgIndex:0,//图片下标
            boxWidth:0,//silderbox-img 的总宽度
            startOffset:0,//上一个图片的offsetX值
            endOffset:0,//最后一个图片的offsetX值
        }
    },
    props:{
        auto:{
            type:Number,
        },
        imgArr:{
            type:Array,
            default:()=>{
                return []
            }
        },
        show:{
            type:String,
            default:()=>{
                return 'block';
            }
        }
    },
    mounted(){
        this.silderBox = this.$refs.silderboxImg;
        let silderItem = this.$refs.silderboxItem;
        this.autoPlay();
        if(this.show == 'none'){
            silderItem.style='display:none;';
        }else if(this.show == 'left'){
            silderItem.style='text-align:left;';
        }else if(this.show == 'right'){
            silderItem.style='text-align:right;';
        }
    },
    created(){
        this.windowWidth = window.screen.width;
        this.boxWidth = this.imgs.length * this.windowWidth;
    },
    methods:{
        touchstart(e){
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.silderBox.style.transition="none";
            clearInterval(this.Swiper)
        },
        touchmove(e){
            this.endX = e.touches[0].clientX;
            this.endY = e.touches[0].clientY;
            //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
            this.direction = this.$tool.GetSlideDirection(this.startX,this.startY,this.endX,this.endY);
            this.startOffset =  -(this.startX - this.endX);

            let s = -this.imgIndex*this.windowWidth+e.touches[0].pageX-this.startX;

            // this.silderBox.style.transform=`translate3d(${s}px,0,0)`;
            this.silderBox.style.webkitTransform =`translate3d(${s}px,0,0)`;
        },
        touchend(e){
            this.endX = e.changedTouches[0].clientX;
            this.endY = e.changedTouches[0].clientY;
            this.imgIndex = Number(e.target.dataset.item);//第几张图片的下标

            // let str = this.$refs.silderboxImg.style.transform;
            // let curidx = Math.abs(str.substring(str.indexOf('(')+1,str.length-1).split(',')[0].replace('px',''));
            // this.imgIndex = Math.round(curidx / this.windowWidth);
            // console.log(curidx,this.imgIndex);

            this.$refs.silderboxImg.style.transition=".5s";
            this.endOffset = Math.abs(this.startX-this.endX);
            this.autoPlay();

            if(this.direction == 1 || this.direction == 2){
                // this.silderBox.style.transform=`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                this.silderBox.style.webkitTransform =`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                return;
            }
            // 如果是只是点击则不切换图片
            if(this.endOffset <= 50){
                // this.silderBox.style.transform=`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                this.silderBox.style.webkitTransform =`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                return;
            }

            if(this.direction == 3){//向右
                if(this.imgIndex == this.imgs.length-1){
                    // this.silderBox.style.transform=`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                    this.silderBox.style.webkitTransform =`translate3d(${-((this.imgIndex)*this.windowWidth)}px,0,0)`;
                    return;
                }

                // this.silderBox.style.transform=`translate3d(${-((this.imgIndex+1)*this.windowWidth)}px,0,0)`;
                this.silderBox.style.webkitTransform =`translate3d(${-((this.imgIndex+1)*this.windowWidth)}px,0,0)`;
                this.imgIndex+=1;
                // console.log('向右'+this.imgIndex);
            }else if(this.direction == 4){//向左
                // console.log('向左'+(this.imgIndex-1));
                let res;
                this.imgIndex -= 1;

                if(this.imgIndex <= 0){
                    this.imgIndex = 0;
                    res = 0;
                }else{
                    res = (this.imgIndex+1)*this.windowWidth-this.windowWidth;
                }
                // this.silderBox.style.transform=`translate3d(${-res}px,0,0)`;
                this.silderBox.style.webkitTransform =`translate3d(${-res}px,0,0)`;
            }

            // 获取图片下标
        },
        autoPlay(){
            if(this.auto){

                this.Swiper = setInterval(()=>{
                    this.silderBox.style.transition=".5s";
                    if(this.imgIndex == this.imgs.length-1){

                        // this.silderBox.style.transform=`translate3d(${0}px,0,0)`;
                        this.silderBox.style.webkitTransform =`translate3d(${0}px,0,0)`;
                        this.imgIndex=0;

                    }else{
                        // this.silderBox.style.transform=`translate3d(${-((this.imgIndex+1)*this.windowWidth)}px,0,0)`;
                        this.silderBox.style.webkitTransform =`translate3d(${-((this.imgIndex+1)*this.windowWidth)}px,0,0)`;
                        this.imgIndex+=1;
                    }
                }, this.auto);
            }
        },
    }
}
</script>

<style lang="less">
.silderbox{

    overflow: hidden;
    position: relative;
    .silderbox-img{
        // height: 4rem;
        display: box;
        display: -webkit-box;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        >a{
            width: 100%;
            display: block;
            overflow: hidden;
            img{
                pointer-events:none;
                width: 100%;
                float: left;
            }
        }
    }
    .silderbox-item{
        pointer-events:none;
        position: absolute;
        bottom: 0;
        left: 0;
        padding:.1rem 0;
        height: .25rem;
        line-height: .25rem;
        width: 100%;
        text-align: center;
        >li{
            display: inline-block;
            height: .25rem;
            width: .25rem;
            margin: 0 .05rem;
            border-radius: 50%;
            background: #ccc;
        }
        .curr{
            background: #fd9153;
        }
    }
}

</style>
