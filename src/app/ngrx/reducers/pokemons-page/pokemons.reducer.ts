import { PokemonsPage, getPokemonId } from '../../../models/shared/pokemons-page';
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on, select } from "@ngrx/store";
import * as PokemonsActions from "../../actions/pokemons-page/pokemons.actions";

export interface PokemonsState extends EntityState<PokemonsPage> {
  allPokemonsLoaded: boolean;
  queryPokemons: PokemonsPage[];
}

export const adapter = createEntityAdapter<PokemonsPage>({
  selectId: getPokemonId,
});

export const initialPokemonsState = adapter.getInitialState({
  allPokemonsLoaded: false,
  queryPokemons: []
});

export const pokemonsReducer = createReducer(
  initialPokemonsState,

  on(
    PokemonsActions.allPokemonsLoaded,
    (state, action) =>
      adapter.setAll(action.pokemons, { ...state, allPokemonsLoaded: true })
  ),

  on(
    PokemonsActions.nextPageLoaded,
    (state, action) => {
      return adapter.upsertMany(action.pokemons, {...state})
    }
  ),

  on(
    PokemonsActions.changeFavoriteStatus,
    (state, action) =>
      adapter.updateOne(action.update, {...state})
  ),

  on(
    PokemonsActions.queryPokemons,
    (state, action) => {
      const queryData = action.queryParameters.newValue;
      let queriedPokemonsObject = Object
      .assign({}, ...Object
      .entries(state.entities)
      .filter( ([key,value]) => value.name
      .includes(queryData) )
      .map( ([key,val]) => ({[key]:val}) )
    );
      return {...state, queryPokemons: Object.values(queriedPokemonsObject)}
    }
  ),

  on(
    PokemonsActions.clearQueryPokemons,
    (state, action) => {
      return {...state, queryPokemons: []}
    }
  )

);
export const adapterSelectors = adapter.getSelectors();

