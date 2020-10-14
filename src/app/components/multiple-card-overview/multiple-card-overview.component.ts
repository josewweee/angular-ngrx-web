import { Pokemon } from './../../models/pokemon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as CanvasJS from '../../shared/canvasjs.min';

@Component({
  selector: 'app-multiple-card-overview',
  templateUrl: './multiple-card-overview.component.html',
  styleUrls: ['./multiple-card-overview.component.scss'],
})
export class MultipleCardOverviewComponent implements OnInit {
  title1: string;
  title2: string;
  pokemonImage1: string;
  pokemonImage2: string;
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  infoDetails: any[];
  chartHeight: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<MultipleCardOverviewComponent>
  ) {
    this.title1 = data.dialogTitle1;
    this.title2 = data.dialogTitle2;
    this.pokemonImage1 = data.photo1;
    this.pokemonImage2 = data.photo2;
    this.pokemon1 = data.pokemon1;
    this.pokemon2 = data.pokemon2;
    this.chartHeight = '300px';
    this.infoDetails = [
      {
        pokemon1: `${this.pokemon1.height} lbs`,
        stat: 'Height',
        pokemon2: `${this.pokemon2.height} lbs`,
      },
      {
        pokemon1: `${this.pokemon1.weight} ft`,
        stat: 'Weight',
        pokemon2: `${this.pokemon2.weight} ft`,
      },
      { pokemon1: 'Male', stat: 'Gender', pokemon2: 'Female' },
    ];
    CanvasJS.addColorSet('green', [
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
    ]);
  }

  ngOnInit(): void {
    this.Createchart();
  }

  onClose(data) {
    this.dialogRef.close(null);
  }

  Createchart() {
    let chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      colorSet: 'green',
      height: 300,
      title: {
        text: 'Stats',
      },
      axisY: {
        gridThickness: 0,
      },
      data: [
        {
          type: 'column',
          color: 'gold',
          dataPoints: [
            { y: this.pokemon1.stats[0].base_stat, label: 'hp' },
            { y: this.pokemon1.stats[1].base_stat, label: 'attack' },
            { y: this.pokemon1.stats[2].base_stat, label: 'defense' },
            { y: this.pokemon1.stats[3].base_stat, label: 'sp-attack' },
            { y: this.pokemon1.stats[4].base_stat, label: 'sp-defense' },
            { y: this.pokemon1.stats[5].base_stat, label: 'speed' },
          ],
        },
        {
          type: 'column',
          dataPoints: [
            { y: this.pokemon2.stats[0].base_stat, label: 'hp' },
            { y: this.pokemon2.stats[1].base_stat, label: 'attack' },
            { y: this.pokemon2.stats[2].base_stat, label: 'defense' },
            { y: this.pokemon2.stats[3].base_stat, label: 'sp-attack' },
            { y: this.pokemon2.stats[4].base_stat, label: 'sp-defense' },
            { y: this.pokemon2.stats[5].base_stat, label: 'speed' },
          ],
        },
      ],
    });

    chart.render();
  }
}
