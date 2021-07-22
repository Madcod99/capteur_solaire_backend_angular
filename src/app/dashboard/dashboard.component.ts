import { Component, OnInit } from '@angular/core';
import { TemperatureService } from '../shared/temperature.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private temperatureService: TemperatureService) { }

  ngOnInit(): void {

    this.mafonction()
  }
  mafonction() {
    this.temperatureService.getTemperature().subscribe(res => {
      console.log('Err', res)
    }, err => {
      console.log('Err', err)
    })
  }
}
