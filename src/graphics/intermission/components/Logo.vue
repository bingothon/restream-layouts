<template>
	<div
		class="Logo FlexContainer"
	>
		<img src="logo-winter.png">
	</div>
</template>

<script lang="ts">
	import {Prop, Vue, Component} from 'vue-property-decorator'
	@Component({})
    export default class Logo extends Vue {
	};
</script>

<style scoped>
	.Logo {
		position: fixed;
	}
	.Logo > img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
