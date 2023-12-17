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
          <tr class="row" v-for="prj in projects" @dblclick="openProject(prj)">
            <td>{{ prj.id }}</td>
            <td>{{ prj.name }}</td>
            <td>{{ prj.desc }}</td>
          </tr>
        </table>
        <base-button>פרוייקט חדש</base-button>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useProjectList } from "./projectList.js";
import BaseButton from "../components/ui/BaseButton.vue";

const router = useRouter();
const route = useRoute();

const [projects, plistMethods] = useProjectList();
plistMethods.loadProjects();

function openProject(prj) {
  router.push({ path: `/project/${prj.id}` });
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width:100%;
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

tr.row:hover {
  background-color: #cad8ee;
}
</style>
