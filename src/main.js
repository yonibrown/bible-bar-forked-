import { createApp } from 'vue';

import router from './router.js';
import App from './App.vue';

import BaseCard from './components/ui/BaseCard.vue';
import BaseEditable from './components/ui/BaseEditable.vue';
import BaseScrollable from './components/ui/BaseScrollable.vue';
import BaseDroppable from './components/ui/BaseDroppable.vue';
import BaseDraggable from './components/ui/BaseDraggable.vue';

import LinkBox from './components/link/LinkBox.vue';
import BarBox from './components/bar/BarBox.vue';
import TextBox from './components/text/TextBox.vue';
import PartsBox from './components/part/PartsBox.vue';

const app = createApp(App)

app.use(router);

app.component('base-card', BaseCard);
app.component('base-editable', BaseEditable);
app.component('base-scrollable', BaseScrollable);
app.component('base-droppable', BaseDroppable);
app.component('base-draggable', BaseDraggable);

app.component('link-box', LinkBox);
app.component('bar-box', BarBox);
app.component('text-box', TextBox);
app.component('parts-box', PartsBox);

app.mount('#app');
