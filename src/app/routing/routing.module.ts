import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { TimelineChartComponent} from '../timeline-chart/timeline-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ScatterPlotComponent} from '../scatter-plot/scatter-plot.component';

const routes: Routes = [
  {path: 'timeline',  component: TimelineChartComponent},
  {path: 'bar',       component: BarChartComponent},
  {path: 'scatter',   component: ScatterPlotComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class RoutingModule {
  static components = [
    TimelineChartComponent,
    BarChartComponent,
    ScatterPlotComponent
  ];
}
