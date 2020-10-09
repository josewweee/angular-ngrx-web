import { Pokemon } from './../../models/pokemon';
import { FetchedPokemonsEntityService } from './../../services/fetched-pokemons/fetched-pokemons-entity.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokemonEntityService } from 'src/app/services/pokemon-entity.service';
import * as CanvasJS from '../../shared/canvasjs.min';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-single-card-overview',
  templateUrl: './single-card-overview.component.html',
  styleUrls: ['./single-card-overview.component.scss'],
})
export class SingleCardOverviewComponent implements OnInit {
  pokemon: Pokemon;
  pokemonImage: string;
  title: string;
  chartHeight: string;
  constructor(
    private dialogRef: MatDialogRef<SingleCardOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.dialogTitle;
    this.pokemonImage = data.photo;
    this.pokemon = data.pokemon;
    console.log(this.pokemon);

    CanvasJS.addColorSet('green', [
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
    ]);

    this.chartHeight = '300px';
  }

  ngOnInit(): void {
    this.Createchart();
  }

  onClose(data) {
    if (data !== null) {
      let pokemon = { ...data };
      pokemon.photo = this.pokemonImage;
      this.dialogRef.close(pokemon);
    } else {
      this.dialogRef.close(null);
    }
  }

  Createchart() {
    let chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      colorSet: 'green',
      title: {
        text: 'Stats',
      },
      axisY: {
        gridThickness: 0,
      },
      data: [
        {
          type: 'column',
          dataPoints: [
            { y: this.pokemon.stats[0].base_stat, label: 'hp' },
            { y: this.pokemon.stats[1].base_stat, label: 'attack' },
            { y: this.pokemon.stats[2].base_stat, label: 'defense' },
            { y: this.pokemon.stats[3].base_stat, label: 'sp-attack' },
            { y: this.pokemon.stats[4].base_stat, label: 'sp-defense' },
            { y: this.pokemon.stats[5].base_stat, label: 'speed' },
          ],
        },
      ],
    });

    chart.render();
  }
}
