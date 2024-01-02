<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import svgIcon from '@jamescoyle/vue-icon';

defineProps({
	subtext: String,
	title: String,
	mdiIconPath: String,
	primary: Boolean
})
</script>

<template>
	<div class="section" :class="{ 'bi-primary': primary, 'bi-basic': !primary}">
		<main>
			<div class="section-info">
				<div>
					<p>{{ subtext }}</p>
					<h1>{{ title }}<svgIcon type="mdi" :path="mdiIconPath" style="color: gold;" /></h1>
				</div>
			</div>
			<slot></slot>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.bi-primary {
	//background: linear-gradient(0.5turn, var(--primaryDark), var(--primaryV), var(--primaryDark));
	//background: linear-gradient(to right, var(--primaryV), var(--primary));
	background-color: var(--primaryV);
}

.bi-basic {
	background: linear-gradient(to right, black, var(--primaryDark));
}

.section {
	height: 100%;
    color: rgba(255, 255, 255, 0.9);

	.section-info {
		display: flex;
		justify-content: space-between;
	}

	P {
		color: gold;
	}

    h1 {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 900;
        letter-spacing: 0.15rem;
    }
}
</style>
