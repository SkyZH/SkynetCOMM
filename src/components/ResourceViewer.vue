<template>
  <div>
    <input type="number" placeholder="from" class="form-control" v-model="from" @keyup="onChange">
    <input type="number" placeholder="to" class="form-control" v-model="to" @keyup="onChange">
    <input type="checkbox" class="form-control" v-model="live" @change="onChange">
    {{ data }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Resource, IReport, IData, Precision } from '../models/Resource';
import { Subject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, switchMap } from 'rxjs/operators';
import _ from 'lodash';

interface IDataRequest {
  stream: boolean,
  limit?: number,
  from: string,
  to?: string,
  precision: Precision
}

@Component
export default class ResourceViewer extends Vue {
  private from: string = "1535520840";
  private to: string = "1535522700";
  private live: boolean = false;
  private fired: string = "";

  private dataSource$: Subject<IDataRequest> | null = null;
  private data$: Observable<IData[]> | null = null;
  private sub: Subscription | null = null;
  private resource: Resource | null = null;
  private data: IData[] = [];

  created() {
    this.resource = new Resource('Raspi_Mon', 'CPU');
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
      this.requestStream(this.from, +this.to, Precision.minute);
    } else {
      this.requestData(this.from, this.to, Precision.minute);
    }
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
