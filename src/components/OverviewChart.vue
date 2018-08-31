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

const MARGIN_TOP = 15;

@Component
export default class OverviewChart extends Vue {
  @Prop() private width?: number;
  @Prop() private height?: number;
  @Prop() private data?: IData[];
  @Prop() private title?: string;

  @Prop() private fill?: string;
  @Prop() private stroke?: string;
  
  private g?: any;
  private gA?: any;
  private x?: any;
  private y?: any;
  private xAxis?: any;

  mounted() {
    this.init();
  }

  @Watch('width')
  onWidthChanged(val: number) {
    this.recreate();
  }

  @Watch('height')
  onHeightChanged(val: number) {
    this.recreate();
  }


  @Watch('data')
  onDataChanged(val: IData[]) { 
    this.update(this.g, this.x, this.y, this.gA);
  }

  init() {
    this.recreate();
  }
  
  contentHeight() {
    return this.height! - MARGIN_TOP;
  }

  update(g: any, x: any, y: any, gA: any) {
    // 0. Transform data
    const parsedData = _.map(this.data, d => ({
      timestamp: new Date(d.report.timestamp * 1000),
      data: d.report.data
    }) as IParsedData);
    // 1. Define Axis
    x.domain(d3.extent(parsedData, (d: IParsedData) => d.timestamp));
    y.domain(d3.extent(parsedData, (d: IParsedData) => d.data));
    this.xAxis.scale(x);
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
    // 6. Update Axis
    gA.select('.x')
      .call(this.xAxis)
      .selectAll('text')
      .style('font-size', '8px')
      .style('text-anchor', 'end')
      .attr('transform', 'translate(5, 0)')
  }

  recreate() {
    // 0. Create components
    const x = d3.scaleTime()
      .range([0, this.width!])
    this.x = x;
    const y = d3.scaleLinear()
      .range([this.contentHeight(), 0])
    this.y = y;
    // 1. Refer to base component
    const parent = d3.select(this.$el)
      .attr('width', this.width!)
      .attr('height', this.height!)
    parent.selectAll('*').remove()
    const g = parent.append('g').attr('transform', `translate(0, ${MARGIN_TOP})`);
    this.g = g;
    // 2. Create Axis
    this.xAxis = d3.axisTop()
      .tickFormat((d: Date) => moment(d).format(this.width! < 1000 ? 'MM/DD HH:mm' : 'MM/DD HH:mm:ss'));
    if (this.width! < 768) this.xAxis.ticks(4);
    const gA = parent.append('g')
      .attr('transform', `translate(0, ${MARGIN_TOP})`);
    gA.append('g').attr('class', 'x');
    this.gA = gA;
    this.update(this.g, this.x, this.y, this.gA);
    // 3. Create Title
    parent.append('g').append('text')
      .attr('text-anchor', 'start')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.height! + 5)
      .attr('y', 10)
      .style('font-size', '12px')
      .text(this.title);

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
