import { addFavorite } from './../../../ngrx/actions/favorite-pokemons/favorite-pokemons.actions';
import { changeFavoriteStatus } from './../../../ngrx/actions/pokemons-page/pokemons.actions';
import { selectAllFavoritePokemons } from '../../../ngrx/selectors/favorite-pokemons/favorite-pokemons.selector';
import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GraphService } from 'src/app/services/graphs/graph.service';
import { first, map, take, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Subscription, noop } from 'rxjs';
import { Update } from '@ngrx/entity';
import { removeFavorite } from 'src/app/ngrx/actions/favorite-pokemons/favorite-pokemons.actions';

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
  favoriteSubscription: Subscription;
  graph: any;

  constructor(
    private dialogRef: MatDialogRef<SingleCardOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private graphService: GraphService,
    private store: Store
  ) {
    this.pokemon = data.pokemon;
    this.pokemonPageInfo = data.pokemonPageInfo;
    this.favoriteStatus = data.pokemonPageInfo.isFavorite;
    this.title = data.pokemonPageInfo.name;
    this.pokemonImage = data.pokemonPageInfo.photo;
    this.graph = graphService.Generate();
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
            // @ts-ignore
            { y: this.pokemon.stats[1].base_stat, label: 'attack' },
            // @ts-ignore
            { y: this.pokemon.stats[2].base_stat, label: 'defense' },
            // @ts-ignore
            { y: this.pokemon.stats[3].base_stat, label: 'sp-attack' },
            // @ts-ignore
            { y: this.pokemon.stats[4].base_stat, label: 'sp-defense' },
            // @ts-ignore
            { y: this.pokemon.stats[5].base_stat, label: 'speed' },
          ],
        },
      ],
    });

    chart.render();
  }

  addToFavorites(pokemon: PokemonsPage) {
    let favoritesLength: number;
    let removingFavorite: boolean = false;

    this.favoriteSubscription = this.store.pipe(
      select(selectAllFavoritePokemons),
      map( (favorites) => {
        favoritesLength = favorites.length;

        if(favorites.some((item) => item.name === pokemon.name)) {
          removingFavorite = true;
        }
      }),
      first(),
      tap(() => {
        if (removingFavorite) {
          const newPokemon = { ...pokemon, isFavorite: false };
          const updatedPokemon: Update<PokemonsPage> = {
            id: pokemon.id,
            changes: newPokemon
          }
          this.favoriteStatus = false;
          const newActionRemovingFavorite = removeFavorite({pokemon: newPokemon})
          const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
          this.store.dispatch(newActionRemovingFavorite);
          this.store.dispatch(newActionChangeFavoriteStatus);
        } else {
          if (favoritesLength !== undefined && favoritesLength >= 5) {
            console.warn(`Favorite Limit Reached`);
          } else {
            const newPokemon = { ...pokemon, isFavorite: true };
            const updatedPokemon: Update<PokemonsPage> = {
              id: pokemon.id,
              changes: newPokemon
            }
            this.favoriteStatus = true;
            const newActionAddingFavorite = addFavorite({pokemon: newPokemon})
            const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
            this.store.dispatch(newActionAddingFavorite);
            this.store.dispatch(newActionChangeFavoriteStatus);
          }
        }
      })
    ).subscribe()
  }
}
