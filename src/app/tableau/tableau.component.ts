import { Component, OnInit } from '@angular/core';
import { DataFromBackModel } from '../models/data.model';
import { TemperatureService } from '../shared/temperature.service';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.css']
})
export class TableauComponent implements OnInit {

  p: number = 1;
  data: DataFromBackModel[];
  displaytable: boolean = false;
  constructor(private dataSource: TemperatureService) {

    this.dataSource.getTemperature().subscribe(res => {
      this.data = res;
      console.log('::>',this.data);
      this.displaytable = true;
    }, err => {
      console.log('ERREUR', err);
    });

  }

  ngOnInit(): void {

  }

}
