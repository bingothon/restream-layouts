<template>
    <div class="SubTop">
        <div id="SubNotifs">
            <img id="emote" src="../../../static/emote-ayaya.png">
            <img id="bubble" src="../../../static/speechbubble.png">
            <div id="subText">Thank you<br>for subscribing</div>
            <div id="subName">
                <text-fit id="text" :text="`${username}`" align="center"></text-fit>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import TextFit from "../helpers/text-fit.vue";
import {nodecg} from "../../browser-util/nodecg";

@Component({
    components: {
        TextFit,
    }
})


export default class SubNotifs extends Vue {

    username: string = "LongerName";

    mounted() {
        nodecg.listenFor("newSub", (data) => {
            console.log(`here should be data:`, data)
            this.username = data.username;
            document.getElementById("SubNotifsNeutral").style.top = "0px"; 
            //TODO trigger animation
        })
    }

}

</script>

<style scoped>

#SubNotifs {
    position: relative;
    top: 200px;
}

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
