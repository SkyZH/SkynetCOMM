<template>
  <div id="app" class="d-flex flex-column align-items-center">
    <div id="home-placeholder"></div>
    <h1><em>SkyNet</em>·COMM</h1>
    <h3><del>Big Brother is Watching You.</del></h3>
    <h2>Mr. Chi is monitoring his RasPi.</h2>
    <p>Below are real-time data refreshing <SourceSwitch id="source_switch" v-model="source"></SourceSwitch></p>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'CPU'" :fill="'#73e8ff'" :stroke="'#29b6f6'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'Memory'" :fill="'#64d8cb'" :stroke="'#26a69a'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :title="'Temp.'" :subscription="'Temperature'" :fill="'#ffff89'" :stroke="'#d4e157'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <ResourceViewer class="resource" :source="'Raspi_Mon'" :subscription="'Voltage'" :fill="'#ffd95b'" :stroke="'#ffa726'" :precision="source" :from="from" :limit="120" :live="true"></ResourceViewer>
    <p>An <a href="https://github.com/SkyZH/Skynetcomm">open-source project</a> by <a href="https://github.com/SkyZH">Sky Zhang</a></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ResourceViewer from './components/ResourceViewer.vue';
import SourceSwitch from './components/SourceSwitch.vue';
import moment from 'moment';

@Component({
  components: {
    ResourceViewer,
    SourceSwitch,
  },
})
export default class App extends Vue {
  private source: string = 'second';
  private from: string = moment(Date.now()).subtract(1, 'month').unix().toString();
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

