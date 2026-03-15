import { Producto } from '../../domain/entities/Producto.js';

export class CreateProductoUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(data) {
    return this.r.save(new Producto({ id_producto: null, ...data }));
  }
}

export class ListProductosUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(opts) { return this.r.findAll(opts); }
}

export class GetProductoUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(id) {
    const p = await this.r.findById(id);
    if (!p) throw new Error('Producto no encontrado');
    return p;
  }
}

export class UpdateProductoUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(id, data) {
    const actual = await this.r.findById(id);
    if (!actual) throw new Error('Producto no encontrado');
    Object.assign(actual, data);
    return this.r.update(actual);
  }
}

export class DeleteProductoUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(id) {
    const p = await this.r.findById(id);
    if (!p) throw new Error('Producto no encontrado');
    await this.r.softDelete(id);
  }
}

export class AjustarInventarioUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute({ id_producto, tipo_inventario, cantidad, tipo_movimiento, id_usuario, observacion }) {
    const p = await this.r.findById(id_producto);
    if (!p) throw new Error('Producto no encontrado');
    await this.r.ajustarInventario({ id_producto, tipo_inventario, cantidad, tipo_movimiento, id_usuario, observacion });
    return this.r.getInventario(id_producto);
  }
}

export class ListMovimientosUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(opts) { return this.r.listMovimientos(opts); }
}

export class GetInventarioUseCase {
  constructor(productoRepository) { this.r = productoRepository; }
  async execute(id_producto) { return this.r.getInventario(id_producto); }
}
