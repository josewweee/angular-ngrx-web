import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as CanvasJS from '../../../shared/canvasjs.min.js';
import { FavoritesUtils } from 'src/app/shared/utils/addFavorites';

@Component({
  selector: 'app-single-card-overview',
  templateUrl: './single-card-overview.component.html',
  styleUrls: ['./single-card-overview.component.scss'],
})
export class SingleCardOverviewComponent implements OnInit {
  pokemon: Pokemon;
  pokemonImage: string;
  pokemonPageInfo: PokemonsPage;
  favoriteStatus: boolean;
  title: string;
  chartHeight: string;
  graph: CanvasJS;

  constructor(
    private dialogRef: MatDialogRef<SingleCardOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store
  ) {
    this.pokemon = data.pokemon;
    this.pokemonPageInfo = data.pokemonPageInfo;
    this.favoriteStatus = data.pokemonPageInfo.isFavorite;
    this.title = data.pokemonPageInfo.name;
    this.pokemonImage = data.pokemonPageInfo.photo;
    this.graph = CanvasJS;
  }

  ngOnInit(): void {
    this.graph.addColorSet('green', [
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
      '#38786a',
    ]);

    this.chartHeight = '300px';
    this.createchart();
  }

  onClose(data: Pokemon) {
    if (data !== null) {
      let pokemon = { ...data };
      pokemon.photo = this.pokemonImage;
      this.dialogRef.close(pokemon);
    } else {
      this.dialogRef.close(null);
    }
  }

  createchart() {
    let chart = new this.graph.Chart('chartContainer', {
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

  addToFavorites(pokemon: PokemonsPage) {
    this.favoriteStatus = FavoritesUtils.addFavorites(pokemon, this.store).status;
  }
}
