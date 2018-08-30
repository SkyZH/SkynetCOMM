<template>
<svg id="chart"></svg>
</template>

<script lang="ts">
/* tslint: disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { IData, IReport } from '@/models/Resource';
import _ from 'lodash';
import moment from 'moment';
const d3 = require('d3');

interface IParsedData {
  timestamp: Date;
  data: number;
}

@Component
export default class OverviewChart extends Vue {
  @Prop() private size?: [number, number];
  @Prop() private data?: IData[];
  @Prop() private title?: string;

  @Prop() private fill?: string;
  @Prop() private stroke?: string;
  
  private g?: any;
  private x?: any;
  private y?: any;

  mounted() {
    this.init();
  }

  @Watch('size')
  onSizeChanged(val: [number, number], oldval: [number, number]) {
    this.recreate();
  }

  @Watch('data')
  onDataChanged(val: IData[]) { 
    this.update(this.g, this.x, this.y);
  }

  init() {
    this.recreate();
  }

  update(g: any, x: any, y: any) {
    // 0. Transform data
    const parsedData = _.map(this.data, d => ({
      timestamp: new Date(d.report.timestamp * 1000),
      data: d.report.data
    }) as IParsedData);
    // 1. Define Axis
    x.domain(d3.extent(parsedData, (d: IParsedData) => d.timestamp));
    y.domain(d3.extent(parsedData, (d: IParsedData) => d.data));
    // 2. Create Area
    const area = d3.area()
      .x((d: IParsedData) => x(d.timestamp))
      .y1((d: IParsedData) => y(d.data))
      .curve(d3.curveStepAfter);
    // 3. Define Area
    area.y0(y(0));
    // 4. Clear Area
    g.select('path').remove();
    // 5. Draw Area
    g.append('path')
      .datum(parsedData)
      .attr('fill', this.fill!)
      .attr('d', area)
      .attr('stroke', this.stroke!)
      .attr('stroke-width', 0.5);
  }

  recreate() {
    // 0. Create components
    const x = d3.scaleTime()
      .range([0, this.size![0]])
    this.x = x;
    const y = d3.scaleLinear()
      .range([this.size![1], 0])
    this.y = y;
    // 1. Refer to base component
    const parent = d3.select(this.$el)
      .attr('width', this.size![0])
      .attr('height', this.size![1])
    parent.selectAll('*').remove()
    const g = parent.append('g');
    this.g = g;
    this.update(this.g, this.x, this.y);
    // 2. Create Title
    parent.append('g').append('text')
      .attr('text-anchor', 'start')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.size![1] + 5)
      .attr('y', 10)
      .style('font-size', '12px')
      .text(this.title);
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
