// deno-lint-ignore-file

// Creación de mi Schema
export interface Productos{
    _id: {$oid: string};
    name: string;
    price: Number;
    img: string;
    stock: Number;
}