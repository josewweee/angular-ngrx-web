import { first } from 'rxjs/operators';
import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as CanvasJS from '../../../shared/canvasjs.min.js';
import { FavoritesUtils } from 'src/app/shared/utils/addFavorites';
import { searchPokemons } from 'src/app/ngrx/selectors/pokemons-page/pokemons.selector';
import { onCloseResponse } from 'src/app/shared/default-dialog-config';

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
  addedFavoriteWhileInQuery: boolean = false;

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
    let pokemon: Pokemon
    if (data !== null) {
      pokemon = { ...data };
      pokemon.photo = this.pokemonImage;
    } else {
      pokemon = null
    }
    const returnInfo: onCloseResponse = {
      pokemon,
      favoriteWhileQuery: this.addedFavoriteWhileInQuery
    }
    this.dialogRef.close(returnInfo);
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
    this.store.pipe(
      select(searchPokemons),
      first()
    )
    .subscribe(queryPokemons => {
      if(queryPokemons.length > 0){
        this.addedFavoriteWhileInQuery = true;
      }
    })
  }
}
