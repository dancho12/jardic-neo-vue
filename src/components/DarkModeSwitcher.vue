<template>
  <div class="dark-light-mode" :style="switcherBackgroundColor" @click="toggleColorTheme">
    <div class="dark-light-mode__swither" :class="{
      'dark-light-mode__swither--dark': mode === APP_COLOR_THEME_DARK,
      'dark-light-mode__swither--light': mode === APP_COLOR_THEME_LIGHT,
      'dark-light-mode__swither--translate': mode === APP_COLOR_THEME_DARK,
    }" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount } from 'vue'



const reverseThemeSchema = {
  dark: 'light',
  light: 'dark'
}

export default defineComponent({
  name: 'DarkLightMode',
  props: {
    modelValue: {
      type: String,
      required: true,
      default: () => 'dark'
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    onBeforeMount(() => {
      changeColorSchema()
    })

    const APP_COLOR_THEME_DARK = 'dark'
    const APP_COLOR_THEME_LIGHT = 'light'

    const mode = ref(props.modelValue)

    const switcherBackgroundColor = computed(() => {
      return {
        'background-color': mode.value === APP_COLOR_THEME_DARK ? '#ffffff' : '#373737'
      }
    })

    function toggleColorTheme() {
      mode.value = reverseThemeSchema[mode.value]
      window.localStorage.setItem('appColorTheme', mode.value)
      emit("update:modelValue", mode.value);
      changeColorSchema()

    }

    function changeColorSchema() {
      document.documentElement.setAttribute('data-theme', mode.value);
    }


    return {
      switcherBackgroundColor,
      mode,
      toggleColorTheme,
      APP_COLOR_THEME_DARK,
      APP_COLOR_THEME_LIGHT
    }
  }
})
</script>

<style lang="scss">
.dark-light-mode {
  position: relative;
  width: 48px;
  height: 20px;
  border-radius: 100px;
  transition: 200ms;
  padding: 2px;
  cursor: pointer;
}

.dark-light-mode__swither {
  width: 18px;
  height: 18px;
  position: absolute;
  border-radius: 100%;
  background-size: cover;
  transition: 500ms;
  cursor: pointer;

  &--dark {
    background-image: url(@/assets/pics/sun.png);
  }

  &--light {
    background-image: url(@/assets/pics/moon.png);
  }

  &--translate {
    transform: translateX(140%);
  }
}
</style>
