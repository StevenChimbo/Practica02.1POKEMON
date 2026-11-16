import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Pokemon, Movimiento } from '../modelos/pokemon';

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private url = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // ENDPOINT 1: /pokemon/{nombre}  -> estadísticas, tipos y movimientos
  async buscarPokemon(nombre: string): Promise<Pokemon> {
    const d: any = await firstValueFrom(
      this.http.get(this.url + '/pokemon/' + nombre.trim().toLowerCase())
    );
    const stat = (n: string) => d.stats.find((s: any) => s.stat.name === n).base_stat;
    return {
      nombre: d.name,
      imagen: d.sprites.front_default,
      tipos: d.types.map((t: any) => t.type.name),
      hp: stat('hp'),
      ataque: stat('attack'),
      defensa: stat('defense'),
      velocidad: stat('speed'),
      movimientos: d.moves.map((m: any) => m.move.name)
    };
  }

  // ENDPOINT 2: /move/{nombre}  -> poder y tipo del movimiento
  async obtenerMovimiento(nombre: string): Promise<Movimiento> {
    const d: any = await firstValueFrom(this.http.get(this.url + '/move/' + nombre));
    return { nombre: d.name, poder: d.power || 0, tipo: d.type.name };
  }

  // ENDPOINT 3: /type/{nombre}  -> a qué tipos les hace doble, mitad o cero daño
  async obtenerEfectividad(tipoAtaque: string, tiposDefensor: string[]): Promise<number> {
    const d: any = await firstValueFrom(this.http.get(this.url + '/type/' + tipoAtaque));
    const rel = d.damage_relations;
    const lista = (campo: string) => rel[campo].map((t: any) => t.name);

    let multiplicador = 1;
    for (const tipo of tiposDefensor) {
      if (lista('double_damage_to').includes(tipo)) multiplicador *= 2;
      if (lista('half_damage_to').includes(tipo)) multiplicador *= 0.5;
      if (lista('no_damage_to').includes(tipo)) multiplicador *= 0;
    }
    return multiplicador;
  }
}
