import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import Swal from 'sweetalert2'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'edit-pokemon',
  templateUrl: './edit-pokemon.component.html',
  styleUrls: ['./edit-pokemon.component.scss']
})
export class EditPokemonComponent {

  pokemon: Pokemon
  pokemonForm: FormGroup;

  file: File | null = null;
  imageUrl: string;

  constructor(
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditPokemonComponent>,
    @Inject(MAT_DIALOG_DATA) public pokemonId: number,
  ) {
    console.log('id', pokemonId);
    this.pokemonForm = this.createForm();
    this.getPokemon(pokemonId);
  }

  getPokemon(id: number) {
    this.pokemonService.getPokemonById(id).subscribe((pokemon: any) => {
      console.log('pokemon', pokemon);
      this.pokemon = pokemon;
      this.pokemonForm.get('name').setValue(this.pokemon.name);
      this.imageUrl = this.pokemon.image;
    }, error => {
      console.error(error);
    });
  }

  createForm() {
    return this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      image: new FormControl(null),
      url: new FormControl('')
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    const blob = new Blob([this.file], { type: 'image/*' });
    const imageUrl = URL.createObjectURL(blob);
    this.imageUrl = imageUrl;
  }

  onSubmit() {
    const pokemon = this.pokemonForm.value;
    pokemon.id = this.pokemon.id;
    pokemon.url = this.pokemon.url;
    pokemon.image = this.imageUrl;
    // output pokemon
    this.dialogRef.close(pokemon);
    Swal.fire({
      title: "Pokemon actualizado",
      text: "Actualizando lista de pokemones...",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6"
    })
  }
}
