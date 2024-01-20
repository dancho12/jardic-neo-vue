<template>
  <div class="dark-light-mode" :style="switcherBackgroundColor" @click="toggleColorTheme">
    <div class="dark-light-mode__swither" :class="{
      'dark-light-mode__swither--dark': mode === APP_COLOR_THEME_DARK,
      'dark-light-mode__swither--light': mode === APP_COLOR_THEME_LIGHT,
      'dark-light-mode__swither--translate': mode === APP_COLOR_THEME_DARK,
    }" />
  </div>
</template>

<script >
import { defineComponent, ref, computed, onBeforeMount } from 'vue'



const reverseThemeSchema = {
  dark: 'light',
  light: 'dark'
}

export default defineComponent({
  name: 'DarkLightMode',

  setup() {
    onBeforeMount(() => {
      changeColorSchema()
    })

    const APP_COLOR_THEME_DARK = 'dark'
    const APP_COLOR_THEME_LIGHT = 'light'

    const mode = ref(window.localStorage.getItem('appColorTheme') || APP_COLOR_THEME_DARK)
    const switcherBackgroundColor = computed(() => {
      return {
        'background-color': mode.value === APP_COLOR_THEME_DARK ? '#ffffff' : '#373737'
      }
    })

    function toggleColorTheme() {
      mode.value = reverseThemeSchema[mode.value]
      window.localStorage.setItem('appColorTheme', mode.value)

      changeColorSchema()
    }

    function changeColorSchema() {



      let dark = {
        '--find-color': '#e86969',
        '--reading-color': '#D16464',
        '--kanji-color': '#29C5FF',
        '--text-color': '#fff',
        '--special-color-1': '#A0A0A0',
        '--special-color-2': '#2ECC71',
        '--main-background-color': '#404040',
        '--cards-background-color': '#303030',
        '--accent-color': '#D16464',
        '--accent-color-hover': '#e86969',
        '--accent-color-gray': '#D0D0D0',
        '--paginator-hover': 'rgba(255, 255, 255, 0.08)',
        '--skeleton-0': '#808080',
        '--skeleton-100': '#a9adb0'
      }
      let light = {
        '--find-color': '#e86969',
        '--reading-color': '#D16464',
        '--kanji-color': '#1297E0',
        '--text-color': '#000000',
        '--special-color-1': '#A0A0A0',
        '--special-color-2': '#2ECC71',
        '--main-background-color': '#FFF',
        '--cards-background-color': '#ECF0F1',
        '--accent-color': '#D16464',
        '--accent-color-hover': '#e86969',
        '--accent-color-gray': '#D0D0D0',
        '--paginator-hover': 'rgba(160, 160, 160, 0.16)',
        '--skeleton-0': '#c2cfd6',
        '--skeleton-100': '#f0f3f5'
      }

      if (mode.value === APP_COLOR_THEME_LIGHT) {

        for (const key in light) {
          document.documentElement.style.setProperty(key, light[key])
        }

        // document.documentElement.style.setProperty('--main-text-color', '#2e2e2e')
        // document.documentElement.style.setProperty('--main-color', '#2e2e2e')
        // document.documentElement.style.setProperty('--background-color', '#ffffff')
        // document.documentElement.style.setProperty('--secondary-color', '#f4f4f4')
      } else {

        for (const key in dark) {
          document.documentElement.style.setProperty(key, dark[key])
        }
        // document.documentElement.style.setProperty('--main-text-color', '#ffffff')
        // document.documentElement.style.setProperty('--main-color', '#373737')
        // document.documentElement.style.setProperty('--background-color', '#191919')
        // document.documentElement.style.setProperty('--secondary-color', '#1f1f1f')
      }
    }

    return {
      mode,
      toggleColorTheme,
      switcherBackgroundColor,
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
  width: 17px;
  height: 17px;
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
