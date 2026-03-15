export class Moneda {
  constructor({
    id_moneda,
    codigo,
    nombre,
    simbolo,
    es_principal
  }) {
    this.id_moneda = id_moneda;
    this.codigo = codigo;
    this.nombre = nombre;
    this.simbolo = simbolo;
    this.es_principal = es_principal ?? false;
  }
}
