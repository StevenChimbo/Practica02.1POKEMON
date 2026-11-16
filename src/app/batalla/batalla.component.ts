import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../servicios/poke-api.service';
import { Pokemon, Movimiento } from '../modelos/pokemon';

@Component({
  selector: 'app-batalla',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './batalla.component.html',
  styleUrl: './batalla.component.css'
})
export class BatallaComponent {
  // Entradas del usuario
  nombre1 = '';
  nombre2 = '';

  // Pokémon elegidos y su vida actual
  jugador1: Pokemon | null = null;
  jugador2: Pokemon | null = null;
  vida1 = 0;
  vida2 = 0;

  // Estados de la pantalla
  cargando = false;
  error = '';
  terminada = false;
  registro: string[] = [];   // historial de lo que pasa en la batalla

  constructor(private api: PokeApiService) {}

  // ---------- Buscar un Pokémon ----------
  async buscar(numero: number) {
    const nombre = numero === 1 ? this.nombre1 : this.nombre2;
    if (nombre.trim() === '') {
      this.error = 'Escribe el nombre de un Pokémon.';
      return;
    }
    this.cargando = true;
    this.error = '';
    try {
      const p = await this.api.buscarPokemon(nombre);
      if (numero === 1) { this.jugador1 = p; this.vida1 = p.hp * 2; }
      else { this.jugador2 = p; this.vida2 = p.hp * 2; }
      this.reiniciarBatalla();
    } catch (e) {
      this.error = 'No se encontró el Pokémon "' + nombre + '".';
    }
    this.cargando = false;
  }

  // ---------- Un turno: cada Pokémon ataca una vez ----------
  async jugarTurno() {
    if (!this.jugador1 || !this.jugador2 || this.terminada) return;
    this.cargando = true;
    this.error = '';
    try {
      // El más rápido ataca primero
      const veloz1 = this.jugador1.velocidad >= this.jugador2.velocidad;
      if (veloz1) {
        await this.atacar(1);
        if (this.vida2 > 0) await this.atacar(2);
      } else {
        await this.atacar(2);
        if (this.vida1 > 0) await this.atacar(1);
      }
      this.revisarGanador();
    } catch (e) {
      this.error = 'Error al consultar PokéAPI. Intenta de nuevo.';
    }
    this.cargando = false;
  }

  // ---------- Ataque de un Pokémon ----------
  private async atacar(numero: number) {
    const atacante = numero === 1 ? this.jugador1! : this.jugador2!;
    const defensor = numero === 1 ? this.jugador2! : this.jugador1!;

    // 1. Elegir un movimiento al azar que tenga poder
    const mov = await this.elegirMovimiento(atacante);

    // 2. Efectividad del tipo del movimiento contra el defensor
    const efectividad = await this.api.obtenerEfectividad(mov.tipo, defensor.tipos);

    // 3. Daño = poder * (ataque / defensa) / 5 * efectividad
    let dano = Math.round(((mov.poder * atacante.ataque) / defensor.defensa) / 5 * efectividad);

    // 4. Restar vida (nunca menos de 0)
    if (numero === 1) this.vida2 = Math.max(0, this.vida2 - dano);
    else this.vida1 = Math.max(0, this.vida1 - dano);

    // 5. Mensaje para el historial
    let texto = atacante.nombre + ' usa ' + mov.nombre + ' y causa ' + dano + ' de daño.';
    if (efectividad > 1) texto += ' ¡Es muy efectivo!';
    if (efectividad > 0 && efectividad < 1) texto += ' No es muy efectivo.';
    if (efectividad === 0) texto += ' No afecta al rival.';
    this.registro.unshift(texto);
  }

  private async elegirMovimiento(p: Pokemon): Promise<Movimiento> {
    // Probamos hasta 10 movimientos al azar buscando uno con poder
    for (let i = 0; i < 10; i++) {
      const azar = Math.floor(Math.random() * p.movimientos.length);
      const mov = await this.api.obtenerMovimiento(p.movimientos[azar]);
      if (mov.poder > 0) return mov;
    }
    return { nombre: 'placaje', poder: 40, tipo: 'normal' };
  }

  private revisarGanador() {
    if (this.vida1 === 0 || this.vida2 === 0) {
      this.terminada = true;
      const ganador = this.vida1 > 0 ? this.jugador1!.nombre : this.jugador2!.nombre;
      this.registro.unshift('🏆 ¡Ganó ' + ganador + '!');
    }
  }

  // ---------- Reiniciar ----------
  reiniciarBatalla() {
    if (this.jugador1) this.vida1 = this.jugador1.hp * 2;
    if (this.jugador2) this.vida2 = this.jugador2.hp * 2;
    this.terminada = false;
    this.registro = [];
  }

  // Porcentaje de vida para la barra
  porcentaje(vida: number, p: Pokemon | null): number {
    return p ? Math.round((vida / (p.hp * 2)) * 100) : 0;
  }
}
