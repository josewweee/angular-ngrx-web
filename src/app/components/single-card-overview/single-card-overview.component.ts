import { FavoriteEntityService } from './../../services/favorite-pokemons/favorite-entity.service';
import { PokemonsPage } from './../../models/shared/pokemons-page';
import { Pokemon } from '../../models/shared/pokemon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokemonEntityService } from '../../services/pokemons-page/pokemon-entity.service';
import * as CanvasJS from '../../shared/canvasjs.min';

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

  constructor(
    private dialogRef: MatDialogRef<SingleCardOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private favoriteService: FavoriteEntityService,
    private pokemonsFetchService: PokemonEntityService
  ) {
    this.pokemon = data.pokemon;
    this.pokemonPageInfo = data.pokemonPageInfo;
    this.favoriteStatus = data.pokemonPageInfo.isFavorite;
    this.title = data.pokemonPageInfo.name;
    this.pokemonImage = data.pokemonPageInfo.photo;
  }

  ngOnInit(): void {
    CanvasJS.addColorSet('green', [
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

  onClose(data) {
    if (data !== null) {
      let pokemon = { ...data };
      pokemon.photo = this.pokemonImage;
      this.dialogRef.close(pokemon);
    } else {
      this.dialogRef.close(null);
    }
  }

  createchart() {
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

  addToFavorites(pokemon: PokemonsPage) {
    let favoritesLength = undefined;
    let removingFavorite = false;

    this.favoriteService.entities$.subscribe((entities) => {
      favoritesLength = entities.length;
      if (entities.find((item) => item.name == pokemon.name)) {
        removingFavorite = true;
      }
    });

    if (removingFavorite) {
      const newPokemon = { ...pokemon, isFavorite: false };
      this.favoriteStatus = false;
      this.pokemonsFetchService.updateOneInCache(newPokemon);
      this.favoriteService.removeOneFromCache(pokemon);
    } else {
      if (favoritesLength !== undefined && favoritesLength >= 5) {
        console.log(`ya no agregamos mas`);
      } else {
        const newPokemon = { ...pokemon, isFavorite: true };
        this.favoriteStatus = true;
        this.pokemonsFetchService.updateOneInCache(newPokemon);
        this.favoriteService.addOneToCache(pokemon);
      }
    }
  }
}
