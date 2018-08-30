<template>
<a href="javascript:" v-on:click="click()">{{ text(source) }}</a>
</template>

<script lang="ts">
/* tslint: disable */
import { Component, Prop, Model, Vue } from 'vue-property-decorator';

interface IParsedData {
  timestamp: Date;
  data: number;
}

const SOURCE_TO_TEXT: { [src: string]: string } = {
    'second': 'every 5 seconds',
    'minute': 'every minute',
    'hour': 'every hour',
    'day': 'every day'
};

const SWITCH: { [src: string]: string } = {
  'second': 'minute',
  'minute': 'hour',
  'hour': 'day',
  'day': 'second'
};

@Component
export default class SourceSwitch extends Vue {
  @Model('change', { type: String }) source!: string;

  text(source: string) {
    return SOURCE_TO_TEXT[source];
  }

  click() {
    this.$emit('change', SWITCH[this.source]);
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
