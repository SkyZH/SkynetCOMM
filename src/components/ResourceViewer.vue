<template>
  <div>
    <!--<input type="number" placeholder="from" v-model="from" @keyup="onChange">
    <input type="number" placeholder="to" v-model="to" @keyup="onChange">
    <input type="checkbox" v-model="live" @change="onChange">-->
    <div>
      <OverviewChart :data="data" :size="size" :fill="fill" :stroke="stroke" :title="title || subscription"></OverviewChart>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Resource, IReport, IData, Precision } from '@/models/Resource';
import { Subject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, switchMap, flatMap } from 'rxjs/operators';
import _ from 'lodash';
import firebase from '@/database';
import Chart from './Chart.vue';
import OverviewChart from './OverviewChart.vue';

interface IDataRequest {
  stream: boolean,
  limit?: number,
  from: string,
  to?: string,
  precision: Precision
}

@Component({
  components: {
    OverviewChart
  }
})
export default class ResourceViewer extends Vue {
  @Prop() private source?: string;
  @Prop() private subscription?: string;
  @Prop() private title?: string;

  private from: string = "1535520840";
  private to: string = "1535522700";
  private live: boolean = true;
  private fired: string = "";
  private size = [800, 50];

  private dataSource$: Subject<IDataRequest> | null = null;
  private data$: Observable<IData[]> | null = null;
  private sub: Subscription | null = null;
  private resource: Resource | null = null;
  private data: IData[] = [];

  @Prop() private fill?: string;
  @Prop() private stroke?: string;

  created() {
    this.resource = new Resource(this.source!, this.subscription!);
    this.dataSource$ = new Subject<IDataRequest>();
    this.data$ = this.dataSource$.pipe(
      distinctUntilChanged(_.isEqual),
      debounceTime(300),
      switchMap(request => request.stream
        ? this.resource!.stream(request.from, request.limit, request.precision)
        : this.resource!.fetch(request.from, request.to, request.precision))
    );
    this.sub = this.data$.subscribe(data => this.processData(data));
  }

  destroyed() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onChange() {
    if (this.live) {
      this.requestStream(this.from, 120, Precision.second);
    } else {
      this.requestData(this.from, this.to, Precision.second);
    }
  }

  mounted() {
    this.onChange();
  }

  requestData(from: string, to: string, precision: Precision) {
    this.dataSource$!.next({
      stream: false,
      from: from,
      to: to,
      precision: precision
    });
  }

  requestStream(from: string, limit: number, precision: Precision) {
    this.dataSource$!.next({
      stream: true,
      from: from,
      limit: limit,
      precision: precision
    });
  }

  processData(data: IData[]) {
    this.data = data;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
