<template>
  <div>
    <section>
      <base-card>
        <table>
          <tr>
            <th></th>
            <th>שם</th>
            <th>תאור</th>
          </tr>
          <tr
            class="row"
            :class="{ chosen: prj.id == chosenProj.id }"
            v-for="prj in projects"
            @click="chooseProj(prj)"
            @dblclick="openProject(prj)"
          >
            <td>{{ prj.id }}</td>
            <td>{{ prj.name }}</td>
            <td>{{ prj.desc }}</td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input type="text" placeholder="פרוייקט חדש" v-model="newName" />
            </td>
            <td>
              <input type="text" placeholder="תאור" v-model="newDesc" />
              <button :disabled="!displaySubmitNewProj" @click="newProject">
                צור פרוייקט
              </button>
            </td>
          </tr>
        </table>
        <base-button @click="openProject(chosenProj)">פתח</base-button>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useProjectList } from "./projectList.js";
import { ref, computed } from "vue";
import BaseButton from "../components/ui/BaseButton.vue";

const router = useRouter();

const [projects, plistMethods] = useProjectList();
plistMethods.loadProjects();

const newName = ref("");
const newDesc = ref("");
const displaySubmitNewProj = computed(function () {
  return newName.value.trim() != "";
});

function openProject(prj) {
  if (prj.display_version == 1){
    router.push({ path: `/project1/${prj.id}` });
    return;
  }
  router.push({ path: `/project/${prj.id}` });
}

const chosenProj = ref({});
function chooseProj(prj) {
  chosenProj.value = prj;
}

async function newProject() {
  const id = await plistMethods.newProject({
    name: newName.value.trim(),
    desc: newDesc.value.trim(),
  });
  router.push({ path: `/project/${id}` });
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}

th,
td {
  padding: 8px;
  text-align: right;
  border-bottom: 1px solid #ddd;
}

tr.row {
  cursor: pointer;
}

tr.chosen {
  background-color: #cad8ee;
}

tr.row:hover {
  background-color: #cad8ee;
}

button {
  margin-right: 10px;
}
</style>
