// Datos que guardamos de cada Pokémon (solo lo que necesitamos)
export interface Pokemon {
  nombre: string;
  imagen: string;
  tipos: string[];
  hp: number;
  ataque: number;
  defensa: number;
  velocidad: number;
  movimientos: string[];   // direcciones (URL) de los movimientos
}

// Un movimiento ya consultado en PokéAPI
export interface Movimiento {
  nombre: string;
  poder: number;
  tipo: string;
}
