import { createApp } from 'vue';

import router from './router.js';
// import store from './store/index.js';
import App from './App.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseEditable from './components/ui/BaseEditable.vue';
// import BaseButton from './components/ui/BaseButton.vue';
// import BaseBadge from './components/ui/BaseBadge.vue';
// import BaseSpinner from './components/ui/BaseSpinner.vue';
// import BaseDialog from './components/ui/BaseDialog.vue';

import LinkBox from './components/link/LinkBox.vue';
import BarBox from './components/bar/BarBox.vue';
import TextBox from './components/text/TextBox.vue';
import PartsBox from './components/part/PartsBox.vue';

import BarMenu from './components/bar/BarMenu.vue';
import LinksMenu from './components/link/LinksMenu.vue';

const app = createApp(App)

app.use(router);
// app.use(store);

app.component('base-card', BaseCard);
app.component('base-editable', BaseEditable);
// app.component('base-button', BaseButton);
// app.component('base-badge', BaseBadge);
// app.component('base-spinner', BaseSpinner);
// app.component('base-dialog', BaseDialog);

app.component('link-box', LinkBox);
app.component('bar-box', BarBox);
app.component('text-box', TextBox);
app.component('parts-box', PartsBox);

app.component('bar-menu', BarMenu);
app.component('links-menu', LinksMenu);

app.mount('#app');
