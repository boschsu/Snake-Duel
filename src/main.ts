import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/index'
// import { readyFight } from '@/components/readyFight.ce'
// customElements.define('ready-fight', readyFight);
(window as any).apiAddr=process.env==='production'
								?'http://api.snakecloud.com'
								:'http://api.snake.com:3000';

const app=createApp(App);
// app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-');
app.use(store).use(router).mount('#app');
// app.config.compilerOptions.isCustomElement = tag => tag === 'ready-fight'

import { defineCustomElement } from 'vue'
import readyFight from '@/components/readyFight.ce.vue'
const readyFightComponent = defineCustomElement(readyFight);
customElements.define('ready-fight', readyFightComponent);