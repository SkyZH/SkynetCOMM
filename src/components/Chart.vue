<template>
<svg></svg>
</template>

<script lang="ts">
/* tslint: disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { IData, IReport } from '@/models/Resource';
import _ from 'lodash';
import moment from 'moment';
const d3 = require('d3');

const MARGIN = {
  left: 80,
  top: 10,
  right: 10,
  bottom: 100
}

@Component
export default class Chart extends Vue {
  @Prop() private size?: [number, number];
  @Prop() private data?: IData[];

  mounted() {
    this.init();
    this.recreate();
    this.update();
  }

  @Watch('size')
  onSizeChanged(val: [number, number]) {
    this.update();
  }

  @Watch('data')
  onDataChanged(val: IData[]) { 
    this.recreate();
  }

  init() {
    d3.select(this.$el)
      /*
      .attr('width', `${this.size![0] - MARGIN.left - MARGIN.right}`)
      .attr('height', `${this.size![1] - MARGIN.right - MARGIN.bottom}`);*/
  }

  contentBoxWidth() {
    return this.size![0] - MARGIN.left - MARGIN.right;
  }

  contentBoxHeight() {
    return this.size![1] - MARGIN.top - MARGIN.bottom;
  }

  rangeFrom(data: number[]) {
    return [_.min(data) || -1.0, _.max(data) || 1.0];
  }
  rangeTimeFrom(data: number[]) {
    return [new Date((_.min(data) || (Date.now() - 1000) / 1000) * 1000), new Date((_.max(data) || (Date.now() + 1000) / 1000) * 1000)];
  }

  createXScaleFrom(reports: IReport[]) {
    const range: number[] = _.map(reports, 'timestamp');
    return d3.scaleTime()
      .domain(this.rangeTimeFrom(range))
      .range([0, this.contentBoxWidth()])
  }

  createYScaleFrom(reports: IReport[]) {
    const range: number[] = _.map(reports, 'data');
    return d3.scaleLinear()
      .domain(this.rangeFrom(range))
      .range([this.contentBoxHeight(), 0])
      .nice()
  }

  createLineFrom(x: any, y: any) {
    return d3.line()
      .x((d: any) => x(new Date(d.x * 1000)))
      .y((d: any) => y(d.y))
      .curve(d3.curveMonotoneX);
  }

  translate(selection: any, x: number, y: number) {
    selection
      .attr('transform', `translate(${x}, ${y})`);
  }

  recreate() {
    const base = d3.select(this.$el)
      .attr('width', `${this.size![0]}`)
      .attr('height', `${this.size![1]}`)
    base.selectAll('*').remove();
    const content = base.append('g')
      .attr('class', 'content')
      .call(this.translate, MARGIN.left, MARGIN.top);
    const reports: IReport[] = _.map(this.data, 'report');
    const xScale = this.createXScaleFrom(reports);
    const yScale = this.createYScaleFrom(reports);
    const axisLayer = base.append('g')
      .attr('class', 'axis')
      .call(this.translate, MARGIN.left, MARGIN.top);
    const xAxis = axisLayer.append('g') 
      .attr('class', 'x_axis')
      .call(this.translate, 0, this.contentBoxHeight())
      .call(d3.axisBottom(xScale).tickFormat((d: any) => moment(d).format("MM/DD HH:MM")))
        .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .attr('class', 'svg-font');

    const yAxis = axisLayer.append('g')
      .attr('class', 'y_axis')
      .call(d3.axisLeft(yScale).tickFormat((d: any) => `${Math.round(d / 1024.0 / 1024 * 10) / 10.0} MiB`))
      // .call(d3.axisLeft(yScale).tickFormat((d: any) => `${Math.round(d * 1000) / 10.0}%`))
      // .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('class', 'svg-font');
    const data = _.map(reports, report => ({
      x: report.timestamp,
      y: report.data
    }));
    const line = content.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr("fill", "none")
        .attr("stroke", "#3F51B5")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr('d', this.createLineFrom(xScale, yScale));
    const dots = content.selectAll('.dot')
      .data(data, (d: any) => d.x)
    .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(d: any) { return xScale(new Date(d.x * 1000)) })
      .attr("cy", function(d: any) { return yScale(d.y) })
      .attr('r', 2)
      .attr('fill', '#3F51B5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    base.select('.content');
  }
  
  update() {
    const processedData = _.map(this.data, 'report');
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
