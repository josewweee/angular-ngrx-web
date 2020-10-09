import { Pokemon } from './../../models/pokemon';
import { FetchedPokemonsEntityService } from './../../services/fetched-pokemons/fetched-pokemons-entity.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PokemonEntityService } from 'src/app/services/pokemon-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';
import { PokemonsPage } from 'src/app/models/pokemons-page';
import { defaultDialogConfig } from '../../shared/default-dialog-config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from '../multiple-card-overview/multiple-card-overview.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  pokemonsName$: Observable<PokemonsPage[]>;
  isComparing: boolean = false;
  pokemonBeforeComparing: Pokemon;
  pokemonApiOffset: string = '20';

  constructor(
    private pokemonsFetchService: PokemonEntityService,
    private dialog: MatDialog,
    private pokemonFetchService: FetchedPokemonsEntityService
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.pokemonsName$ = this.pokemonsFetchService.entities$.pipe(
      map((pokemons) => pokemons)
    );
  }

  loadMorePokemons() {
    this.pokemonsFetchService.getWithQuery({
      limit: '20',
      id: this.pokemonApiOffset,
    });
    let nextOffsetInt = parseInt(this.pokemonApiOffset) + 20;
    this.pokemonApiOffset = nextOffsetInt + '';
  }

  async openPokemonModal(pokemon) {
    const dialogConfig = defaultDialogConfig();

    const pokemonData = await this.pokemonFetchService
      .getByKey(pokemon.url)
      .toPromise();

    if (this.isComparing) {
      dialogConfig.data = {
        dialogTitle1: this.pokemonBeforeComparing.name,
        dialogTitle2: pokemonData.name,
        photo1: this.pokemonBeforeComparing.photo,
        photo2: pokemon.photo,
        pokemon1: this.pokemonBeforeComparing,
        pokemon2: pokemonData,
      };
      this.dialog
        .open(MultipleCardOverviewComponent, dialogConfig)
        .afterClosed()
        .subscribe((data: Pokemon) => {
          if (data !== null) {
            this.pokemonBeforeComparing = data;
            this.isComparing = true;
          } else {
            this.isComparing = false;
          }
        });
    } else {
      dialogConfig.data = {
        dialogTitle: pokemon.name,
        photo: pokemon.photo,
        pokemon: pokemonData,
      };

      this.dialog
        .open(SingleCardOverviewComponent, dialogConfig)
        .afterClosed()
        .subscribe((data: Pokemon) => {
          if (data !== null) {
            this.pokemonBeforeComparing = data;
            this.isComparing = true;
          } else {
            this.isComparing = false;
          }
        });
    }
  }
}
