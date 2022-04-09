import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CadastroClient } from 'src/app/shared/client/cadastro.client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  public cadastroForm?: FormGroup;

  public options = [{ value: 'normal', text: 'Entrega Normal' }, { value: 'rapida', text: 'Entrega Rapida'}];

  public price = 0;
  public data ?: Date;

  constructor(private readonly formBuilder: FormBuilder, private readonly cadastroClient: CadastroClient, private readonly router: Router) { }

  ngOnInit(): void {
    this.setupForm();
  }

  onSubmit(): void {
    this.cadastroForm?.controls['preco_total'].enable();
    this.cadastroClient.insertPedido(this.cadastroForm?.value).subscribe((pedido) => {
        if (pedido.cod_seguranca) {
          this.router.navigate([`correios/pedidos`]);
        }
      }
    )
  }

  updatePesoPrice(event: Event): void {
    const peso = Number((event.target as HTMLInputElement).value);
    this.price = (peso * 0.42);
    if (this.cadastroForm?.controls['opcoes'].value === 'rapida') {
      this.price += 50;
    }
    else if (this.cadastroForm?.controls['opcoes'].value === 'normal') {
      this.price += 20;
    }
    this.cadastroForm?.patchValue({
      preco_total: this.price.toFixed(2),
    });
  }

  updateOpcaoPrice(): void {
    const opcao = this.cadastroForm?.controls['opcoes'].value;
    if (opcao === 'rapida') {
      this.price = (this.cadastroForm?.controls['peso_produto'].value * 0.42) + 50;
    }
    else if (opcao === 'normal') {
      this.price = (this.cadastroForm?.controls['peso_produto'].value * 0.42) + 20;
    }
    this.cadastroForm?.patchValue({
      preco_total: this.price.toFixed(2),
    });
  }
  somarData():void{
    const opcao = this.cadastroForm?.controls['opcoes'].value;
    if (opcao === 'rapida'){
      this.data = (this.cadastroForm?.controls['tempo_entrega'].value + 5);
    }else if (opcao === 'normal'){
      this.data = (this.cadastroForm?.controls['tempo_entrega'].value + 30);
    }
    this.cadastroForm?.controls['tempo_entrega'].value == this.data;
  }

  setupForm(): void {
    this.cadastroForm = this.formBuilder.group({
      numero_cartao: ['', Validators.required],
      nome: ['', Validators.required],
      nome_pedido: ['', Validators.required],
      cpf: ['', Validators.required],
      cod_seguranca: [0, [Validators.min(100), Validators.max(999)]],
      cep: ['', Validators.required],
      peso_produto: [0, Validators.min(1)],
      data_envio: [,Validators.required],
      tempo_entrega: [,],
      endereco_entrega: ['', Validators.required],
      preco_total: [''],
      opcoes: [''],
    });
    this.cadastroForm.controls['preco_total'].disable();
  }
}
