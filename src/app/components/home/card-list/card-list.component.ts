import { concatMap, filter, skipWhile } from 'rxjs/operators';
import { fetchingInProcess, selectAllFetchedPokemons } from './../../../ngrx/selectors/fetched-pokemons/pokemons.selector';
import { fetchPokemon } from './../../../ngrx/actions/fetched-pokemons/fetched-pokemons.actions';
import { selectAllPokemons } from './../../../ngrx/selectors/pokemons-page/pokemons.selector';
import { PokemonsState } from '../../../ngrx/reducers/pokemons-page/pokemons.reducer';
import { SearchBarEventArgs } from '../../../models/nav-bar/search-bar-event-args';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, map, switchMap, take, takeUntil, tap, filter } from 'rxjs/operators';
import { defaultDialogConfig } from '../../../shared/default-dialog-config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from '../multiple-card-overview/multiple-card-overview.component';
import { ComponentType } from '@angular/cdk/portal';
import { select, Store } from '@ngrx/store';
import { loadNextPokemonPage } from 'src/app/ngrx/actions/pokemons-page/pokemons.actions';
import { addFavorites } from '../../../shared/utils/addFavorites';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit, OnDestroy {
  pokemonsPage$: Observable<PokemonsPage[]>;
  isComparing: boolean = false;
  pokemonBeforeComparing: Pokemon;
  pokemonApiOffset: string = '20';
  queryParams: string = '';

  fetchingToApiSubscription: Subscription;
  dialogSubscription: Subscription;
  apiOffsetSubscription: Subscription;

  ngOnDestroyActivated$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private loader: NgxUiLoaderService,
    private store: Store<PokemonsState>
  ) {}

  ngOnInit(): void {
    this.loadStoredPokemons();

    this.apiOffsetSubscription = this.store.pipe(
      select(selectAllPokemons),
      take(1))
      .subscribe( pokemons => this.pokemonApiOffset = pokemons.length + '')
  }

  ngOnDestroy() {
    this.tryToUnsuscribe(this.fetchingToApiSubscription);
  }

  tryToUnsuscribe(variable: Subscription) {
    if (variable !== undefined) {
      variable.unsubscribe();
    }
  }

  loadStoredPokemons() {
    this.pokemonsPage$ = this.store.pipe(
      select(selectAllPokemons)
    );
  }

  filterPokemons(data: SearchBarEventArgs) {
    this.queryParams = data.newValue;
    if (this.queryParams !== '' && this.queryParams !== undefined) {
      this.pokemonsPage$ = this.store.pipe(
        select(selectAllPokemons),
        map((pokemons) =>
          pokemons.filter((item) => item.name.includes(this.queryParams))
        )
      );
    } else {
      this.loadStoredPokemons();
    }
  }

  addToFavorites(pokemon: PokemonsPage) {
    addFavorites(pokemon, this.store);
  }

  loadMorePokemons() {
    const newLoadPageAction = loadNextPokemonPage({ offset: this.pokemonApiOffset });
    this.store.dispatch(newLoadPageAction)
    let nextOffsetInt = parseInt(this.pokemonApiOffset) + 20;
    this.pokemonApiOffset = nextOffsetInt.toFixed(0);
  }

  openPokemonDialog(pokemon: PokemonsPage) {
    const dialogConfig: MatDialogConfig = defaultDialogConfig();
    let requestedPokemon: Pokemon;
    let processCompleted: boolean = false;

    this.getPokemonFromStoreOrApi(pokemon);

    this.fetchingToApiSubscription = this.store.pipe(
      select(fetchingInProcess),
      switchMap(
        isFetching => {
          if(!processCompleted)
          {
            if(isFetching === true)
            {
              this.loader.start()
            }
            return this.store.pipe(
              skipWhile(() => isFetching === true),
              select(selectAllFetchedPokemons),
              tap( ()=> {
                this.loader.stop();
                processCompleted = true;
              }),
            );
          } else {
            this.fetchingToApiSubscription.unsubscribe();
          }
        }
      ))
      .subscribe(pokemons => {
        requestedPokemon = pokemons.find(item => item.name === pokemon.name);
        if (this.isComparing) {
          dialogConfig.data = {
            pokemon1: this.pokemonBeforeComparing,
            pokemon2: { ...requestedPokemon, photo: pokemon.photo },
          };
          this.createDialog(MultipleCardOverviewComponent, dialogConfig);
        } else {
          dialogConfig.data = {
            pokemonPageInfo: pokemon,
            pokemon: requestedPokemon,
          };
          this.createDialog(SingleCardOverviewComponent, dialogConfig);
        }
      }
    )
  }

  getPokemonFromStoreOrApi(pokemon: PokemonsPage){
    const newFetchPokemonAction = fetchPokemon({pokemon: pokemon})
    this.store.dispatch(newFetchPokemonAction)

  }

  createDialog(component: ComponentType<any>, dialogConfig: MatDialogConfig) {
    this.dialogSubscription = this.dialog
    .open(component, dialogConfig)
    .afterClosed()
    .pipe(
      first()
    )
    .subscribe(
      (data: Pokemon) => {
        if (data !== null) {
          this.pokemonBeforeComparing = data;
          this.isComparing = true;
        } else {
          this.isComparing = false;
        }
      }
    );
  }
}
