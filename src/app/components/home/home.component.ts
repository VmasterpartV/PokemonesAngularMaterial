import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import {MatDialog} from '@angular/material/dialog';
import { EditPokemonComponent } from '../edit-pokemon/edit-pokemon.component';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pokemons: Pokemon[] = [];
  selectedPokemonId: number;
  displayedColumns: string[] = ['id', 'image', 'name', 'actions'];
  dataSource: MatTableDataSource<Pokemon>;

  constructor(private pokemonService: PokemonService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPokemons();
    this.dataSource = new MatTableDataSource(this.pokemons);
  }

  getPokemons() {
    try {
      this.pokemonService.pokemons$.subscribe((pokemons: Pokemon[]) => {
        this.pokemons = pokemons['results'];
        if (this.dataSource) {
          this.dataSource.data = this.pokemons;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  openDialog(id: number) {
    this.selectedPokemonId = id;
    const dialogRef = this.dialog.open(EditPokemonComponent, {
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.savePokemon(result);
      this.dataSource.data = this.pokemons;
    });
  }

  savePokemon(pokemon: Pokemon) {
    this.pokemonService.updatePokemon(pokemon.id - 1, pokemon);
  }

  deletePokemon(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (id === this.selectedPokemonId) {
          this.selectedPokemonId = null;
        }
        this.pokemonService.deletePokemon(id - 1).subscribe((data: any) => {
          this.pokemons = data.results;
          this.getPokemons();
          Swal.fire({
            title: 'Borrado!',
            text: 'El pokemon ha sido eliminado.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
        })
        }, error => {
          console.error(error);
        });
      }
    });
  }
}
