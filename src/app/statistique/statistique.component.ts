import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TemperatureService } from '../shared/temperature.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';


@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [10, 9, 50, 12, 100, 12, 45], label: 'Series B' },
  ];
  public lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = {
    // backgroundColor : 'rgba(0, 0, 0, 0.1)',
    // fill: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },


  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      // backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  form = new FormGroup({
    dateDebut: new FormControl(null, [Validators.required]),
    dateFin: new FormControl(null, [Validators.required]),
  });

  checkBoxForm = new FormGroup({
    Tab1: new FormControl(false),
    Tab2: new FormControl(false),
    Tab3: new FormControl(false),
    Tab4: new FormControl(false),
    Tab5: new FormControl(false),

    Tv1: new FormControl(false),
    Tv2: new FormControl(false),
    Tv3: new FormControl(false),
    Tv4: new FormControl(false),
    Tv5: new FormControl(false),

    Ts1: new FormControl(false),
    Ts2: new FormControl(false),
    Ts3: new FormControl(false),

    Te1: new FormControl(false),
    Te2: new FormControl(false),
    Te3: new FormControl(false),

    DHT0: new FormControl(false),
    DHT1: new FormControl(false),
    DHT2: new FormControl(false),
    DHT3: new FormControl(false),
    DHT4: new FormControl(false),
  })

  onSubmit() {
    // console.log(this.form.value);
    // console.log(this.checkBoxForm.value);
    // this.generateLabel()
    this.getSelectedValue();
    if (this.form.valid) {
      this.dataSouce.getStatistiques(this.form.value).subscribe(res => {
        console.log(res);
        this.filteredData = res
        this.generateLabel();
        this.formatData()
      });
    } else {
      console.log('Erreur...');
    }
  }

  filteredData = []
  // date d'enregistrement
  generateLabel() {
    this.lineChartLabels = []
    this.filteredData.forEach(elt => {
      this.lineChartLabels.push(elt.date);
    })
    console.log('labels generated::>', this.lineChartLabels)
  }

  // format data with the selected correspondig value
  selectedValue = []

  getSelectedValue() {
    this.selectedValue = [];
    for (const key in this.checkBoxForm.value) {
      if (Object.prototype.hasOwnProperty.call(this.checkBoxForm.value, key)) {
        const element = this.checkBoxForm.value[key];
        if (element != false) {
          this.selectedValue.push(key);
          // console.log("::>", key, element)
        }
      }
    }
    // console.log('selected Value::>', this.selectedValue)
  }

  // create each data object 
  formatData() {
    console.log('Hello');
    this.lineChartData = []
    // { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    
    // this.getSelectedValue()
    console.log(this.selectedValue, this.filteredData);
    this.selectedValue.forEach(elt => {
      let object = {
        data: [],
        label: "default"
      };
      object.label = elt;
      // console.log('ALL FILTERED', object.label, this.filteredData);
      this.filteredData.forEach(elt2 => {
        // console.log('INSIDE ++', elt2.lm35[elt])
        if (elt.startsWith('T')) {
          // console.log('TTTT');
          // console.log('elt::>', elt2.lm35[elt]);
          object.data.push(elt2.lm35[elt]);
        } else {
          // console.log('DDDD');
          object.data.push(elt2.dht[elt]);
        }
      })
      console.log('object::>',object)
      this.lineChartData.push(object);

    });

    console.log("my data::>", this.lineChartLabels, this.lineChartData);
  }

  constructor(private dataSouce: TemperatureService) {


  }

  ngOnInit(): void {


  }

}

interface dataType {
  data: any[];
  label: String;
}
