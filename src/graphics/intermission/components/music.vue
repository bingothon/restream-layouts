<template>
	<div
		v-if="show"
		class="Music FlexContainer"
	>
		<div class="MCat">
			<img src="MCat_Logo.png">
		</div>
		<div class="Name">
			{{ name }}
		</div>
	</div>
</template>

<script lang="ts">
    import {store} from "../../../browser-util/state";

    const song = store.state

    export default class Music extends Vue {
        name: 'Music',
        data() {
            return {
                show: false,
                name: '',
            };
        },
        mounted() {
            song.on('change', (newVal) => {
                if (newVal && newVal.playing) {
                    this.name = newVal.title;
                    this.show = true;
                } else {
                    this.show = false;
                }
            });
        },
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
