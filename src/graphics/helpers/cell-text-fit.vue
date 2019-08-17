<template>
    <div id="container">
        <div id="fittedContent" :style="{transform, top, 'font-size':optimizedFontSize}">{{text}}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { store, getReplicant } from "../../browser-util/state";

@Component({name:"cell-text-fit"})
export default class CellTextFit extends Vue {
    @Prop({required: true})
    text: string;
    @Prop({})
    fontSize: string;
    optimizedFontSize: string = this.fontSize;
    transform: string = "scaleX(1) scaleY(1)";
    top: string = "0";

    @Watch("text")
    fit() {
        this._fit(0);
    }
    _fit(depth) {
        this.transform = `scaleX(1) scaleY(1)`;
        this.top = "0";
        this.$nextTick(()=> {
            // get width height of parent and text container to calc scaling
            const container = this.$el;
            const fittedContent = container.querySelector('#fittedContent');
            var scaleX = container.scrollWidth / fittedContent.scrollWidth;
            var scaleY = container.scrollHeight / fittedContent.scrollHeight;
            const fontSize = window.getComputedStyle(fittedContent).fontSize;
            // limit recursion
            if (depth < 10 && scaleY < 0.8) {
                this.optimizedFontSize = `calc(${fontSize} * 0.9)`;
                this._fit(depth+1);
                return;
            }
            // limit max scale to 1
            scaleX = Math.min(1,scaleX);
            scaleY = Math.min(1,scaleY);
            // center
            var toLeft = (container.scrollWidth - fittedContent.scrollWidth) / 2;
            this.transform = `translateY(-50%) translateX(${toLeft}px) scaleX(${scaleX}) scaleY(${scaleY})`;
            this.top = "50%";
        });
    }
}
</script>

<style>
    #container {
        width: 100%;
        height: 100%;
        text-align: center;
    }
    #fittedContent {
        position: absolute;
        left: 0;
    }
</style>