# Simulador de batallas Pokémon (Angular + PokéAPI)

**Autor:** Steven Chimbo
**Asignatura:** Programación y Plataformas Web – UPS
**Práctica 02:** Desarrollo de una aplicación web interactiva con Angular y PokéAPI

## Propósito
Aplicación que permite elegir dos Pokémon, consultar sus estadísticas y simular una batalla por turnos. Las reglas de combate las implementa la aplicación; PokéAPI solo entrega los datos.

## Funcionalidades
- Búsqueda de dos Pokémon por nombre (botón o tecla Enter).
- Tarjeta con imagen, tipos, ataque, defensa, velocidad y barra de vida.
- Batalla por turnos: ataca primero el más rápido; cada ataque usa un movimiento al azar con poder.
- El daño depende del poder del movimiento, ataque/defensa y la efectividad entre tipos.
- Historial de la batalla, botón de reiniciar y mensajes de carga y error.

## Endpoints de PokéAPI utilizados
| Endpoint | Uso en la aplicación |
|---|---|
| `GET /pokemon/{nombre}` | Estadísticas, tipos, imagen y lista de movimientos |
| `GET /move/{nombre}` | Poder y tipo del movimiento usado en el ataque |
| `GET /type/{nombre}` | Efectividad: doble, mitad o cero daño según el tipo del rival |

Base: `https://pokeapi.co/api/v2`

## Ejecución local
```
npm install
ng serve
```
Abrir `http://localhost:4200`.

## Sitio desplegado (Vercel)
URL: _pegar aquí la URL pública de Vercel_
