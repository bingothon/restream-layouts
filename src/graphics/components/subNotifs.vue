<template>
    <div class="SubNotifs">
        <img id="emote" src="../../../static/emote-ayaya.png">
        <img id="bubble" src="../../../static/speechbubble.png">
        <div id="subText">Thank you<br>for subscribing</div>
        <div id="subName">
            <text-fit id="text" :text="`${username}`" align="center"></text-fit>
        </div>
    </div>
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import TextFit from "../helpers/text-fit.vue";

@Component({
    components: {
        TextFit,
    }
})


export default class SubNotifs extends Vue {

    username: string = "LongerName";

}
</script>

<style scoped>
#emote {
    height: 100px;
}

#bubble {
    width: 300px;
    height: 194px;
}

#subText {
    position: absolute;
    text-align: center;
    top: 20px;
    font-size: 20px;
    left: 180px;
    color: white;
}

#subName {
    position: absolute;
    text-align: center;
    top: 90px;
    left: 125px;
    width: 260px;
    color: white;
    font-weight: bold;
    font-size: 30px;
}

#text {
    position: relative;
}
</style>
