<template>
  <header>

    <div class="head-container" v-if="screenWidth > 768">
      <RouterLink class="logo" to="/"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
      </RouterLink>
      <Search v-model:search="search" v-model:selectedDic="selectedDic" @open_search="open_search" />

      <nav>
        <RouterLink to="/about">{{ $t('nav.about') }}</RouterLink>
        <div class="lang" v-click-out-side="() => lang_open = false">
          <div class="lang-btn" @click="lang_open = lang_open == true ? false : true">
            <SVGIcon :name="'web'" :color="'var(--text-color)'" :size="25" />
            <span>{{ now_locale() }}</span>
          </div>
          <div class="lang-list" v-if="lang_open">
            <span @click="change_locale('ru')">Русский</span>
            <span @click="change_locale('en')">English</span>
            <span @click="change_locale('ja')">日本語</span>
          </div>
        </div>
        <DarkLightMode v-model="theme_mode" />
      </nav>
    </div>
    <div class="head-container" v-else>

      <template v-if="open_search_mob">
        <SVGIcon class="head-container-back-btn" :name="'arrow-left'" :color="'var(--accent-color)'" :size="30" @click="back_btn" />
        <Search v-model:search="search" v-model:selectedDic="selectedDic" @open_search="open_search" />
        <SVGIcon :name="'dots-vertical'" :color="'var(--accent-color)'" :size="25" @click="open_nav_mob = true" stop-click-outside="true" />
      </template>

      <template v-else>
        <RouterLink class="logo" to="/"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
        </RouterLink>
        <nav>
          <SVGIcon :name="'SearchOutline'" :color="'var(--accent-color)'" :size="25" @click="open_search_mob = true" />
          <SVGIcon :name="'dots-vertical'" :color="'var(--accent-color)'" :size="25" @click="open_nav_mob = true" stop-click-outside="true" />
        </nav>
      </template>
      <Transition name="nav-mob-ani">
        <div class="nav-mob" v-if="open_nav_mob" v-click-out-side="() => open_nav_mob = false">
          <nav>
            <div class="nav-mob-logo">
              <SVGIcon class="nav-mob-back-btn" :name="'arrow-left'" :color="'var(--accent-color)'" :size="30" @click="open_nav_mob = false" />
              <RouterLink class="logo" to="/"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" /></RouterLink>
            </div>

            <RouterLink to="/about">{{ $t('nav.about') }}</RouterLink>
            <div class="lang" v-click-out-side="() => lang_open = false">
              <div class="lang-btn" @click="lang_open = lang_open == true ? false : true">
                <SVGIcon :name="'web'" :color="'var(--text-color)'" :size="25" />
                <span>{{ now_locale() }}</span>
              </div>
              <div class="lang-list" v-if="lang_open">
                <span @click="change_locale('ru')">Русский</span>
                <span @click="change_locale('en')">English</span>
                <span @click="change_locale('ja')">日本語</span>
              </div>
            </div>
            <DarkLightMode v-model="theme_mode" />
          </nav>
        </div>
      </Transition>
    </div>
  </header>


  <div class="router-view">
    <div class="router-view-main">
      <RouterView />

      <footer>
        <div class="footer-main">
          <RouterLink class="logo" to="/"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" /></RouterLink>
          <nav>
            <RouterLink to="/">{{ $t('nav.orig') }}</RouterLink>
            <RouterLink to="/about">{{ $t('nav.about') }}</RouterLink>
          </nav>
        </div>
        <span class="footer-text" v-html="jardic_url($t('home.note_t'), 'jardic.ru')"></span>
      </footer>
    </div>

  </div>
</template>
<script>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import i18n from "@/i18n"


import { defineComponent, provide, ref, onMounted, onUnmounted, computed, watch } from 'vue';

export default defineComponent({
  setup() {

    const router = useRouter()
    const route = useRoute()
    var urlParams = new URLSearchParams(window.location.search);
    const search = ref(urlParams.has('q') ? urlParams.get('q') : '')

    provide('search', search)
    const t = ref(generateRandomString(10))
    provide('t', t)


    function open_search() {
      t.value = generateRandomString(10);
      router.push({ path: 'search', query: { q: search.value } })
    }

    function generateRandomString(length) {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomString = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
      }
      return randomString;
    }

    const selectedDic = ref({})
    provide('selectedDic', selectedDic);


    const lang_open = ref(false);

    function change_locale(locale) {
      localStorage.setItem('locale', locale);
      i18n.global.locale.value = locale
      lang_open.value = false;
    }

    function now_locale() {
      var l = {
        ru: "Русский",
        en: "English",
        ja: "日本語"
      }
      return l[i18n.global.locale.value];
    }

    function jardic_url(text, url_text) {
      return text.replace("*url*", '<a href="http://jardic.ru" target="_blank" rel="noopener noreferrer">' + url_text + '</a>')
    }


    const screenWidth = ref(window.innerWidth);
    const handleResize = () => {
      screenWidth.value = window.innerWidth;
    };
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });



    function logo() {
      if (screenWidth.value > 1023) {
        return new URL('./assets/logo.svg', import.meta.url).href;
      } else {
        return new URL('./assets/logo-mob.svg', import.meta.url).href;
      }
    }


    const open_search_mob = ref(window.location.pathname == '/search' ? true : false)
    const open_nav_mob = ref(false)

    watch(route, () => {
      if (route.path == '/search') {
        urlParams = new URLSearchParams(window.location.search);
        search.value = urlParams.has('q') ? urlParams.get('q') : ''
        t.value = generateRandomString(10);
      }
    })

    function back_btn() {

      const path = route.path
      if (path != '/') {
        router.go(-1)
        search.value = urlParams.has('q') ? urlParams.get('q') : ''
        console.log(search.value);
        t.value = generateRandomString(10);
      } else {
        open_search_mob.value = false
      }

    }



    const theme_mode = ref(window.localStorage.getItem('appColorTheme') || 'dark')

    const is_light_theme = computed(() => {
      return theme_mode.value === 'light'
    })
    provide('theme', {
      theme_mode,
      is_light_theme
    });


    return {
      search,
      open_search,
      selectedDic,
      lang_open,
      change_locale,
      now_locale,
      jardic_url,
      screenWidth,
      logo,
      open_search_mob,
      open_nav_mob,
      back_btn,
      theme_mode
    };
  },
});
</script>
<style lang="scss">
body {
  background-color: var(--main-background-color);
  color: var(--text-color);
}

header,
footer {
  & a {
    color: unset;
    text-decoration: none;

    &:hover {
      color: var(--accent-color);
    }
  }


}

a {
  color: var(--kanji-color);

  &:hover {
    color: var(--accent-color);
  }
}





header {
  position: fixed;
  height: 65px;
  width: 100%;
  top: 0;
  z-index: 100;


  .head-container {
    margin-left: auto;
    margin-right: auto;
    max-width: 1220px;
    height: 100%;
    display: flex;
    padding-left: 30px;
    padding-right: 30px;
    align-items: center;
    gap: 20px;

    background: var(--main-background-color);
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    @include is-mobile() {
      max-width: 100%;
      padding-left: 8px;
      padding-right: 8px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }


    & nav {
      flex-shrink: 0;
      display: flex;
      margin-right: 0;
      margin-left: auto;
      gap: 14px;
      font-weight: 500;
    }

    &-back-btn {
      margin-right: 6px;
    }

    & .nav-mob {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      display: flex;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25);

      & nav {
        flex-direction: column;

        width: 40vw;
        height: 100%;
        background: var(--cards-background-color);
        padding: 20px;
      }

      &-logo {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
      }
    }


  }

}


.logo {
  position: relative;
  width: fit-content;

  & img {
    width: 100px;
    margin-top: auto;
    margin-bottom: auto;
  }

  &::after {
    content: "BETA";
    position: absolute;
    top: 4px;
    right: -15px;
    transform: rotate(45deg);
    background-color: #171717;
    color: #fff;
    font-weight: 600;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 7px;
    letter-spacing: 1px;
    opacity: 0.8;
  }
}


.router-view {

  padding-top: 65px;

  min-height: 100vh;
  // max-height: calc(100vh - 65px);


  // overflow-y: scroll;
  display: flex;


  &-main {
    margin: 0 auto;
    max-width: 1280px;
    display: flex;
    flex-direction: column;

    @include is-mobile() {
      max-width: 100%;
    }
  }
}


main {
  margin-bottom: 50px;

  @include is-mobile() {
    margin-left: 8px;
    margin-right: 8px;
  }
}


footer {
  margin-top: auto;
  margin-bottom: 0;
  // height: 180px;
  width: auto;
  min-width: 1230px;
  background: var(--cards-background-color);
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  & .footer-main {
    display: flex;
    justify-content: space-between;

    & nav {
      display: flex;
      gap: 16px;
    }
  }

  & span {
    width: 80%;
    margin-top: auto;
    margin-bottom: 30px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }


  @include is-mobile() {
    min-width: unset;

    & .footer-main {
      text-align: center;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
      align-items: center;

      & nav {
        flex-direction: column;
      }
    }
  }
}


.lang {
  user-select: none;
  position: relative;
  width: 95px;

  &-btn {
    display: flex;
    gap: 4px;
    cursor: pointer;
  }

  &-list {
    position: absolute;
    z-index: 200;
    top: 30px;
    background-color: var(--cards-background-color);
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
  }
}

.nav-mob-ani-enter-active {
  transition: transform 300ms ease-in;
}

.nav-mob-ani-leave-active {
  transform: translateX(12rem);
  transition: transform 300ms ease-out;
}

.nav-mob-ani-enter-from,
.nav-mob-ani-leave-to {
  transform: translateX(12rem);
}
</style>
