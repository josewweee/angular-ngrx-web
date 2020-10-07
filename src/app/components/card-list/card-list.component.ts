import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PokemonEntityService } from 'src/app/services/pokemon-entity.service';
import { map, tap } from 'rxjs/operators';
import { PokemonsPage } from 'src/app/models/pokemons-page';
import { defaultDialogConfig } from '../../shared/default-dialog-config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  pokemonsName$: Observable<PokemonsPage[]>;

  constructor(
    private pokemonsFetchService: PokemonEntityService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    console.log(this.pokemonsFetchService.entities$);

    this.pokemonsName$ = this.pokemonsFetchService.entities$.pipe(
      map((pokemons) => pokemons),
      tap((res) => console.log(res))
    );
  }

  openPokemonModal(pokemon) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'VENUSAUR',
      pokemon,
    };

    this.dialog.open(SingleCardOverviewComponent, dialogConfig);
  }
}
