import { createApp } from 'vue';

import router from './router.js';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css';
import Tooltip from 'primevue/tooltip';

import BaseCard from './components/ui/BaseCard.vue';
import BaseEditable from './components/ui/BaseEditable.vue';
import BaseScrollable from './components/ui/BaseScrollable.vue';
import BaseDroppable from './components/ui/DragDrop/BaseDroppable.vue';
import BaseDraggable from './components/ui/DragDrop/BaseDraggable.vue';
import BaseMenu from './components/ui/BaseMenu.vue';
import MenuButton from './components/ui/MenuButton.vue';
import SortableCell from './components/ui/DragDrop/SortableCell.vue';
import DraggableHead from './components/ui/DragDrop/DraggableHead.vue';
import SpecTable from './components/ui/SpecTable/SpecTable.vue';
import SpecLine from './components/ui/SpecTable/SpecLine.vue';

import LinkBox from './components/link/LinkBox.vue';
import BarBox from './components/bar/BarBox.vue';
import TextBox from './components/text/TextBox.vue';
import PartsBox from './components/part/PartsBox.vue';
import BoardBox from './components/board/BoardBox.vue';
import NewBox from './components/project/NewBox.vue';

import PartsLine from './components/part/PartsLine.vue';
import CollectionLine from './components/part/CollectionLine.vue';
import BoardLine from './components/board/BoardLine.vue';

const app = createApp(App)

app.use(router);
app.use(PrimeVue);

app.directive('tooltip', Tooltip);

app.component('base-card', BaseCard);
app.component('base-editable', BaseEditable);
app.component('base-scrollable', BaseScrollable);
app.component('base-droppable', BaseDroppable);
app.component('base-draggable', BaseDraggable);
app.component('base-menu', BaseMenu);
app.component('menu-button', MenuButton);
app.component('sortable-cell', SortableCell);
app.component('draggable-head', DraggableHead);
app.component('spec-table', SpecTable);
app.component('spec-line', SpecLine);

app.component('link-box', LinkBox);
app.component('bar-box', BarBox);
app.component('text-box', TextBox);
app.component('parts-box', PartsBox);
app.component('board-box', BoardBox);
app.component('new-box', NewBox);

app.component('parts-line', PartsLine);
app.component('collection-line', CollectionLine);
app.component('board-line', BoardLine);

app.mount('#app');
