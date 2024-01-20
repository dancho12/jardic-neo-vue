<template>
    <div class="icon-svg" :class="{ clickable }" :style="styles" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SVGIcon',
    props: {
        name: {
            type: String,
            required: true
        },
        size: {
            type: [String, Number],
            required: false,
            default: '16'
        },
        nav: {
            type: Boolean,
            required: false,
            default: false
        },
        clickable: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            required: false,
            default: "var(--text-color)"
        }
    },
    computed: {
        styles() {
            return {
                'min-width': `${this.size}px`,
                'min-height': `${this.size}px`,
                'max-width': `${this.size}px`,
                'max-height': `${this.size}px`,
                'mask-image': `url(${new URL(`../assets/icons/${this.name}.svg`, import.meta.url).href})`,
                '-webkit-mask-image': `url(${new URL(`../assets/icons/${this.name}.svg`, import.meta.url).href})`,
                'background-color': `${this.color}`
            }
        }
    }
})

</script>

<style scoped lang="scss">
.icon-svg {
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-position: center;
    -webkit-mask-position: center;
}

.clickable {
    cursor: pointer;
}
</style>
