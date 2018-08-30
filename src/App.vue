<template>
  <div id="app" class="d-flex flex-column align-items-center">
    <h1 class="display-3">Skynet·COMM</h1>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'CPU'" :fill="'#73e8ff'" :stroke="'#29b6f6'"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'Memory'" :fill="'#64d8cb'" :stroke="'#26a69a'"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'Temperature'" :fill="'#ffff89'" :stroke="'#d4e157'"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'Voltage'" :fill="'#ffd95b'" :stroke="'#ffa726'"></ResourceViewer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ResourceViewer from './components/ResourceViewer.vue';

@Component({
  components: {
    ResourceViewer,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
  @import "bootstrap/scss/_functions.scss";
  @import "bootstrap/scss/_variables.scss";
  @import "bootstrap/scss/_mixins.scss";
  @import "bootstrap/scss/bootstrap.scss";
  @import url('https://fonts.googleapis.com/css?family=Encode+Sans+Condensed:500');
  .svg-font {
    font-family: "Encode Sans Condensed", sans-serif;
  }
  body {
    font-family: "Encode Sans Condensed", sans-serif;
  }
</style>

<style lang="scss" scoped>
.resource {
  border-style: solid;
  border-color: #ddd;
  border-width: 1px 0px 0px 0px;
  padding-top: 1rem;
}
</style>

