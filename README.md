# Jquery-Form-Validator-Plugin
Plugin genérico de validação de formulário utilizando Jquery e validando através de expressões regulares.

Esse plugin suporta:
* Validação dos seguintes tipos de campos:
    * Email 
        * exemplo: rjsandim@gmail.com
        * is="email"
    * CPF 
        * exemplo: 012.345.678-40
        * is="cpf"
    * Requerido
        * is="required" 
    * Data
        * exemplo: dd/mm/aaaa
        * is="date"
    * Telefone
        * exemplo: (33) 3333-3333 ou (33) 3333-33333
        * is="phone"
        * suporta nono digito
    * Moeda
        * exemplo: 333.333,00
        * is="money"
        * padrão R$
    * CEP
        * exemplo: 79092-251
        *  is="cep"
        *  retorna: estado, cidade, bairro e endereco.
        *  cada retorno deve ser indicado como classe de um input para que o valor seja setado.
    * Senha/Confirmação de Senha
        * is="firstPass", e deve ser confirmado com o is="secondPass". 
* Máscara para os seguintes tipos de campos:
    * CPF
    * Data
    * Telefone
    * CEP
    * Moeda
* Plugin para facilitar o input:
    * datepicker (bootstrap)
* Múltiplos forms por página

# Como instalar
Para instalar o plugin devemos incluir todas as dependências e o *form-validator.js*, como podemos ver no arquivo *index.html*.

```html
<!-- A inclusão do bootstrap é opcional -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
<link rel="stylesheet" href="vendor/datepicker/css/datepicker.css">
<!-- Não incluir duas versões de jquery  -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="vendor/datepicker/js/bootstrap-datepicker.js"></script>
<script src="vendor/masked-input/jquery.maskedinput.min.js"></script>
<script src="form-validator.js"></script>
```
Pronto, o plugin está funcionando.

#Como usar

Para ativar o plugin você deve escrever o seguinte código.

```html
<script type="text/javascript">
	$(document).ready(function() { 
		$('form').formValidator();
	});
</script>
```
Agora para todos os formulários do seu arquivo.html o plugin formValidator estará funcionando, porém devemos indicar para cada tipo de campo qual validação devemos aplicar. Para isso, devemos acrescentar o atributo *is="nome_da_validação"*.

#### Validação de Email

```html
<!-- Note o is="email" -->
<input type="text" name="email" is="email" placeholder="Email"><br>
```

#### Validação de CPF

```html
<!-- Note o is="cpf" -->
<input type="text" name="cpf" is="cpf" placeholder="CPF"><br>
```
#### Validação de Requerido

```html
<!-- Note o is="required" -->
<input type="text" name="required" is="required" placeholder="Requerido"><br>
```

#### Validação de Data

```html
<!-- Note o is="date" -->
<input type="text" name="date" is="date" placeholder="Data"><br>
```
#### Validação de Telefone

```html
<!-- Note o is="phone" -->
<input type="text" name="phone" is="phone" placeholder="Telefone"><br>
```

#### Validação de Moeda

```html
<!-- Note o is="money" -->
<input type="text" name="moeda" is="money" placeholder="Moeda"><br>
```

#### Validação de CEP

```html
<!-- Note o is="cep" -->
<input type="text" name="cep" is="cep" placeholder="CEP"><br>
<!-- O cep procurará as classes de inputs dentro do form: estado, cidade, bairro e endereco para colocar o valor correto do resultado da busca pelo cep -->
<label for="">Estado</label>
<input type="text" class="estado" name="estado" placeholder="Estado"><br>
<label for="">Cidade</label>
<input type="text" class="cidade" name="cidade" placeholder="Cidade"><br>
<label for="">Bairro</label>
<input type="text" class="bairro" name="bairro" placeholder="Bairro"><br>
<label for="">Endereço</label>
<input type="text" class="endereco" name="endereco" placeholder="Endereço"><br>
```

#### Validação de Senha/Confirmação

Verifica se *firstPass* e *secondPass* são iguais.
```html
<label for="">Primeira Senha</label>
<!-- Note o is="firstPass" -->
<input type="password" name="fistPass" is="firstPass" placeholder="Primeira Senha"><br>
<label for="">Segunda Senha</label>
<!-- Note o is="secondPass" -->
<input type="password" name="secondPass" is="secondPass" placeholder="Segunda Senha"><br>
```

### Version
1.0.1