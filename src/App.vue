<template>
  <div id="app">
    <ResourceViewer></ResourceViewer>
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
</style>