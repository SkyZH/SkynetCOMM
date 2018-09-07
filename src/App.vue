<template>
  <div id="app" class="d-flex flex-column align-items-center">
    <div id="home-placeholder"></div>
    <h1><em>SkyNet</em>·COMM</h1>
    <h3><del>Big Brother is Watching You.</del></h3>
    <h2>Mr. Chi is monitoring his <ModelSwitch v-model="model"></ModelSwitch>.</h2>
    <p>Below are real-time data refreshing <SourceSwitch v-model="source"></SourceSwitch></p>
    <ResourceViewer class="resource" :source="model" :subscription="'CPU'" :fill="'#73e8ff'" :stroke="'#29b6f6'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" :source="model" :subscription="'Memory'" :fill="'#64d8cb'" :stroke="'#26a69a'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" :source="model" :title="'Temp.'" :subscription="'Temperature'" :fill="'#ffff89'" :stroke="'#d4e157'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" v-if="model == 'Raspi_Mon'" :source="model" :subscription="'Voltage'" :fill="'#ffd95b'" :stroke="'#ffa726'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <p>An <a href="https://github.com/SkyZH/Skynetcomm">open-source project</a> by <a href="https://github.com/SkyZH">Sky Zhang</a></p>
    <p>Ver. {{ VERSION }}</p>
    <img width="24" height="24" src="/logo.png">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ResourceViewer from './components/ResourceViewer.vue';
import SourceSwitch from './components/SourceSwitch.vue';
import ModelSwitch from './components/ModelSwitch.vue';
import moment from 'moment';

@Component({
  components: {
    ResourceViewer,
    SourceSwitch,
    ModelSwitch
  },
})
export default class App extends Vue {
  private source: string = 'second';
  private model: string = 'Raspi_Mon';
  private from: string = moment(Date.now()).subtract(1, 'month').unix().toString();
  private VERSION = process.env.VERSION;
}
</script>

<style lang="scss">
  @import "bootstrap/scss/bootstrap-reboot.scss";
  @import "bootstrap/scss/bootstrap-grid.scss";
  @import url('https://fonts.googleapis.com/css?family=Encode+Sans+Condensed:500');
  .svg-font {
    font-family: "Encode Sans Condensed", sans-serif;
  }
  body {
    font-family: "Encode Sans Condensed", sans-serif;
  }
</style>

<style lang="scss" scoped>
@import "bootstrap/scss/_functions.scss";
@import "bootstrap/scss/_variables.scss";
@import "bootstrap/scss/_mixins.scss";
#app {
  @include make-container();
  @include make-container-max-widths();
  margin-bottom: 30vh;
}
.resource-container {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
}
.resource {
  border-style: solid;
  border-color: #ddd;
  border-width: 1px 0px 0px 0px;
  padding-top: 1rem;
}
#home-placeholder {
  height: 40vh;
}
a {
  color: #868e96 !important;
  -webkit-text-decoration: dotted underline;
  text-decoration: dotted underline;
}
</style>

