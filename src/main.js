import './assets/main.css'
import Components from './components/Components'
import clickOutSide from './directives/clickoutside'

import i18n from "./i18n"

import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
Components.forEach((component) => {
    app.component(component.name, component)
})
app.use(router)
app.use(i18n)

app.directive('click-out-side', clickOutSide)

app.mount('#app')