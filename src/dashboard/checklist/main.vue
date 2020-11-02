<template>
	<div class="col-sm-4">
		<form>
			<h1>Checklist</h1>
			<VCheckbox>Play Next Run</VCheckbox>
			<VCheckbox>Set Up Bingosync Room (get link + pw from runners/comms)</VCheckbox>

</template>
<script>
@Component({})

export default class Checklist extends Vue {
}
</script>

<style>
body {
	padding: 1em;
}
.border {
	border: 2px solid black;
	border-radius: 5px;
	padding: 5px;
}
.row {
	display: flex;
}

.column {
	flex: 50%;
}
.multiselect {
	border:solid 1px #768948;
	overflow:auto;
}

.multiselect label {
	display:block;
}
.multiselect-on {
	color:#ffffff;
	background-color:#06BA63;
}
#reward {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #06BA63;
	color: white;
	pointer-events: none;
}

#reward.show {
	opacity: 1 !important;
}

</style>
