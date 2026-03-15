import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder para Superusuario y Permisos...');

  // 1. Crear permisos base del sistema
  const permisosData = [
    { nombre: 'GESTION_USUARIOS', descripcion: 'Permite crear, editar, listar y eliminar usuarios', modulo: 'Usuarios' },
    { nombre: 'VER_INVENTARIO', descripcion: 'Permite visualizar el inventario general y legal', modulo: 'Inventario' },
    { nombre: 'GESTION_INVENTARIO', descripcion: 'Permite hacer movimientos y ajustes de inventario', modulo: 'Inventario' },
    { nombre: 'GESTION_COMPRAS', descripcion: 'Permite registrar y gestionar compras a proveedores', modulo: 'Compras' },
    { nombre: 'GESTION_FACTURAS', descripcion: 'Permite gestionar facturas de compras y pagos', modulo: 'Facturacion' },
    { nombre: 'GESTION_TASAS', descripcion: 'Permite actualizar y gestionar tasas de cambio', modulo: 'Configuracion' },
    { nombre: 'GESTION_PROVEEDORES', descripcion: 'Permite crear, editar, listar y eliminar proveedores', modulo: 'Compras' },
  ];

  console.log('Creando permisos base...');
  for (const p of permisosData) {
    await prisma.permiso.upsert({
      where: { nombre: p.nombre },
      update: {},
      create: p,
    });
  }

  // 2. Crear Superusuario (Admin)
  const adminEmail = 'admin@charcuteria.com';
  const plainPassword = 'admin'; // El admin deberá cambiar su contraseña luego.

  // Verificar si ya existe el admin para no pisarlo
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    console.log('Creando superusuario admin...');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const nuevoAdmin = await prisma.usuario.create({
      data: {
        nombre: 'Administrador del Sistema',
        email: adminEmail,
        password: hashedPassword,
        rol: 'admin',
        activo: true
      }
    });

    // 3. Asignar TODOS los permisos al admin
    const todosLosPermisos = await prisma.permiso.findMany();
    
    console.log(`Asignando ${todosLosPermisos.length} permisos al superusuario...`);
    
    const usuarioPermisosData = todosLosPermisos.map(p => ({
      id_usuario: nuevoAdmin.id_usuario,
      id_permiso: p.id_permiso
    }));

    await prisma.usuarioPermiso.createMany({
      data: usuarioPermisosData,
      skipDuplicates: true
    });

    console.log(`✅ Superusuario creado exitosamente (Email: ${adminEmail} | Pass: ${plainPassword})`);
  } else {
    console.log('⚠️ El superusuario admin ya existe. Omitiendo creación.');
  }

  console.log('✅ Seeder finalizado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
