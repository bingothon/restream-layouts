<template>
    <div id="Total">
        {{ totalString }}
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { TweenLite } from 'gsap';
    import { store } from '@/browser-util/state';

    @Component({})
    export default class DonationTotal extends Vue {
        init: boolean = true;
        tweenedTotal: number = -1;

        get donationTotal(): number {
            return store.state.donationTotal;
        }

        @Watch('donationTotal', { immediate: true })
        onTotalChanged() {
            if (this.init) {
                this.tweenedTotal = Math.round(this.donationTotal);
                this.init = false;
            } else {
                TweenLite.to(this.$data, 5, { tweenedTotal: Math.round(this.donationTotal) });
            }
        }

        get totalString(): string {
            return `$${this.tweenedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        }

        mounted() {
            this.onTotalChanged();
        }
    }
</script>

<style scoped>
    #Total {
        padding: 0 10px;
        font-size: 40px;
        font-weight: 500;
        min-width: 50px;
        text-align: center;
        align-self: center;
        font-variant-numeric: tabular-nums;
    }
</style>
