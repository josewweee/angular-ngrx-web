import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BannerComponent } from './components/banner/banner.component';
import { CardListComponent } from './components/home/card-list/card-list.component';
import { PokemonsResolver } from './ngrx/resolvers/pokemons.resolver';

const routes: Routes = [
  {
    path: '',
    component: BannerComponent,
  },
  {
    path: 'banner',
    component: BannerComponent,
  },
  {
    path: 'home',
    component: CardListComponent,
    resolve: {
      pokemons: PokemonsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
