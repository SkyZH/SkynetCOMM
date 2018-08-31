<template>
  <div id="resource_viewer">
    <div>
      <OverviewChart :data="data" :width="size[0]" :height="size[1]" :fill="fill" :stroke="stroke" :title="title || subscription"></OverviewChart>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Resource, IReport, IData, Precision } from '@/models/Resource';
import { Subject, Observable, Subscription, fromEvent } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, switchMap, flatMap, debounce } from 'rxjs/operators';
import _ from 'lodash';
import firebase from '@/database';
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

  @Prop() private from!: string;
  @Prop() private to!: string;
  @Prop() private live!: boolean;
  @Prop() private limit!: number;

  private size = [800, 50];

  private dataSource$!: Subject<IDataRequest>;
  private data$!: Observable<IData[]>;
  private sub!: Subscription;
  private resource!: Resource;
  private data: IData[] = [];

  @Prop() private fill?: string;
  @Prop() private stroke?: string;
  @Prop() private precision!: string;

  @Watch('precision')
  onPrecisionChange() {
    this.onChange();
  }
  @Watch('from')
  onFromChange() { this.onChange(); }
  @Watch('to')
  onToChange() { this.onChange(); }
  @Watch('limit')
  onLimitChange() { this.onChange(); }
  @Watch('live')
  onLiveChange() { this.onChange(); }

  private resizeSub!: Subscription;


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
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  onChange() {
    if (this.live) {
      this.requestStream(this.from, this.limit, this.precision as Precision);
    } else {
      this.requestData(this.from, this.to, this.precision as Precision);
    }
  }

  mounted() {
    this.resizeSub = fromEvent(window, 'resize').pipe(
      debounceTime(300),
      map(d => this.$el.clientWidth)
    ).subscribe(d => {
      this.size[0] = d;
      this.$forceUpdate();
    });
    this.size[0] = this.$el.clientWidth;
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
#resource_viewer {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
}
</style>
