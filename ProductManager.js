const fs = require('fs/promises');

class ProductManager {
  constructor() {
    this.path = "./productos.json";
    this.idCounter = 0;
    this.products = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.idCounter = Math.max(...this.products.map((product) => product.id), 0);
    } catch (error) {
      this.products = [];
    }
  }

  generateProductId() {
    return ++this.idCounter;
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      if (!this.products.some((p) => p.code === code)) {
        const newProduct = {
          id: this.generateProductId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.products.push(newProduct);
        await this.saveProductsToFile();

        console.log(`Se ha agregado el producto: ${title} con éxito`);
      } else {
        console.log(`El código: ${code} se encuentra duplicado, verificar y reemplazar por favor`);
      }
    } catch (error) {
      console.error('Error no se pudo guardar el producto:', error.message);
    }
  }
  async updateProduct(id, updatedProduct) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {

        Object.assign(this.products[index], updatedProduct);


        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} actualizado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo actualizar el producto:', error.message);
    }
  }
  async deleteProduct(id) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {
        this.products.splice(index, 1); 

        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} eliminado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo borrar el producto:', error.message);
    }
  }

  getProducts() {
    console.log(this.products);
  }

  async getProductById(id) {
    const okProduct = this.products.find((product) => product.id === id);

    if (okProduct) {
      console.log("Producto encontrado:");
      console.log(okProduct);
    } else {
      console.log(`Producto con el id ${id} no existe`);
    }
  }
}


async function run() {
  const productManager = new ProductManager();
  await productManager.init();

  console.log("---------Agrego productos-----------");
  await productManager.addProduct('producto 2', 'mercadería', 300, 'imagen1.png', 'bcd153', 10);
  await productManager.addProduct('producto 3', 'mercadería', 400, 'imagen2.png', 'bcd194', 5);

  console.log("---------Agrego producto con code repetido-----------");
  await productManager.addProduct('producto 3', 'mercadería', 400, 'imagen2.png', 'bcd194', 5);

  console.log("---------Agrego productos con campos vacíos-----------");
  await productManager.addProduct('producto 4', '', 300, 'imagen3.png', 'bcd125', 10);

  console.log("---------Muestra de productos-----------");
  productManager.getProducts();

  console.log("---------busqueda por id-----------");
  await productManager.getProductById(1);

  console.log("---------busqueda por id inexistente-----------");
  await productManager.getProductById(6);

  console.log("---------actualizo producto-----------");
  await productManager.updateProduct(1, {
    title: 'producto actualizado1',
    description: 'nueva descripción',
    price: 500,
    thumbnail: 'nueva_imagen.png',
    code: 'bcd126',
    stock: 8,
  });

  console.log("---------muestra de productos actualizados-----------");
  await productManager.getProducts();

  console.log("---------elimino producto-----------");
  await productManager.deleteProduct(1);

  console.log("---------muestra de productos después de eliminar-----------");
  await productManager.getProducts();
}
run();
// se creo funcion de simulacion para ejecutar lo solicitado