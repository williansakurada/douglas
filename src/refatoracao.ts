class Consumidor {
  private readonly _nome: string;
  private readonly _idade: number;
  private readonly _email: string;

  constructor(nome: string, idade: number, email: string) {
    this._nome = Consumidor.validarNome(nome);
    this._idade = Consumidor.validarIdade(idade);
    this._email = Consumidor.validarEmail(email);
  }

  get nome(): string {
    return this._nome;
  }

  get idade(): number {
    return this._idade;
  }

  get email(): string {
    return this._email;
  }

  public formatarExibicao(): string {
    return `Consumidor: ${this._nome} (${this._idade} anos) - ${this._email}`;
  }

  private static validarNome(nome: string): string {
    const limpo = nome?.trim();
    if (!limpo || limpo.length < 2) {
      throw new Error("Nome inválido: informe ao menos 2 caracteres.");
    }
    return limpo;
  }

  private static validarIdade(idade: number): number {
    if (!Number.isInteger(idade) || idade < 0 || idade > 120) {
      throw new Error("Idade inválida: informe um inteiro entre 0 e 120.");
    }
    return idade;
  }

  private static validarEmail(email: string): string {
    const limpo = email?.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!limpo || !regex.test(limpo)) {
      throw new Error("E-mail inválido.");
    }
    return limpo;
  }
}

class CadastroConsumidores {
  private readonly consumidores: Consumidor[] = [];

  public adicionar(consumidor: Consumidor): void {
    if (this.consumidores.some(c => c.email === consumidor.email)) {
      throw new Error(`E-mail já cadastrado: ${consumidor.email}`);
    }
    this.consumidores.push(consumidor);
  }

  public listar(): Consumidor[] {
    return [...this.consumidores];
  }

  public calcularMediaIdade(): number {
    if (this.consumidores.length === 0) return 0;
    const soma = this.consumidores.reduce((acc, c) => acc + c.idade, 0);
    return soma / this.consumidores.length;
  }

  public obterExtremosIdade(): { maisVelho?: Consumidor; maisNovo?: Consumidor } {
    if (this.consumidores.length === 0) return {};

    let maisVelho = this.consumidores[0];
    let maisNovo = this.consumidores[0];

    for (const c of this.consumidores) {
      if (c.idade > maisVelho.idade) maisVelho = c;
      if (c.idade < maisNovo.idade) maisNovo = c;
    }
    return { maisVelho, maisNovo };
  }
}

const cadastro = new CadastroConsumidores();

cadastro.adicionar(new Consumidor("Ana Silva", 30, "ana@email.com"));
cadastro.adicionar(new Consumidor("Carlos Souza", 22, "carlos@email.com"));
cadastro.adicionar(new Consumidor("Mariana Lima", 45, "mariana@email.com"));
cadastro.adicionar(new Consumidor("Roberto Alves", 19, "roberto@email.com"));
cadastro.adicionar(new Consumidor("Fernanda Dias", 33, "fernanda@email.com"));

console.log("=== LISTA DE CONSUMIDORES ===");
cadastro.listar().forEach(c => console.log(c.formatarExibicao()));

console.log("\n=== ANÁLISE ESTATÍSTICA ===");
console.log(`Média das Idades: ${cadastro.calcularMediaIdade().toFixed(1)} anos`);

const { maisVelho, maisNovo } = cadastro.obterExtremosIdade();
if (maisVelho && maisNovo) {
  console.log(`Mais Velho(a): ${maisVelho.nome} (${maisVelho.idade} anos)`);
  console.log(`Mais Novo(a): ${maisNovo.nome} (${maisNovo.idade} anos)`);
} else {
  console.log("Não foi possível calcular os extremos de idade");
}

console.log("\n=== TESTE DE VALIDAÇÕES ===");
const tentativasInvalidas: Array<[string, number, string]> = [
  ["", 25, "vazio@email.com"],
  ["João", -5, "joao@email.com"],
  ["Maria", 28, "email-sem-arroba"],
  ["Ana Duplicada", 40, "ana@email.com"],
];

for (const [nome, idade, email] of tentativasInvalidas) {
  try {
    cadastro.adicionar(new Consumidor(nome, idade, email));
  } catch (erro) {
    console.log(`Erro: ${(erro as Error).message}`);
  }
}