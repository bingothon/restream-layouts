<template>
	<div
		v-if="show"
		class="Music FlexContainer"
	>
		<div class="MCat">
			<img src="music.png">
		</div>
		<div class="Name">
			{{ name }}
		</div>
	</div>
</template>

<script lang="ts">
    import {store} from "../../../browser-util/state";
    import {SongData} from "../../../../schemas";
    import {Prop, Vue} from "vue-property-decorator";

    export default class Music extends Vue {
		show: boolean = false;
		name: string = '';

        mounted() {
            store.watch((state) => state.songData, this.onSongDataUpdate)
        }

		onSongDataUpdate(newSong : SongData | undefined) {
            if (newSong && newSong.playing) {
                this.name = newSong.title;
                this.show = true;
            } else {
                this.show = false;
            }
        }
    };
</script>

<style scoped>
	@import url('../../_misc/common.css');
	.Music {
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	.MCat {
		box-sizing: border-box;
		background-color: var(--container-background-color);
		height: 100%;
		padding: 5px;
	}
	.MCat > img {
		height: 100%;
		object-fit: contain;
	}
	.Name {
		flex: 1;
		padding: 0 15px;
		line-height: 70%;
	}
</style>
