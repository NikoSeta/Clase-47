// deno-lint-ignore-file
import { MongoClient } from "../../devDeps.ts";
import { Productos } from "../models/productos.ts";
import {config} from "../../devDeps.ts";

config({ export: true });

const URI= Deno.env.get("URI");

console.log(`Hola !! ${URI}`);

const client = new MongoClient();
try {
    await client.connect(`${URI}`);
        console.log("Base de datos Mongo conectada"); 
}catch(err){
    console.log(err);
}

const db = client.database("productosDeno");
const productos = db.collection<Productos>("Productos");

// Mostrar todos los productos
const getProducts = async ({response} : {response: any}) =>{
    try{
        const allProducts = await productos.find({}).toArray();
        console.log(allProducts);
        if(allProducts) {
            response.status = 200;
            response.body = {
                success: true,
                data: allProducts,
            };
        }else{
            response.status = 500;
            response.body = {
                success: false,
                msg: "Internal Server Error",
            };
        }
    }catch (err){
        response.body = {
            success: false,
            msg: err.toString(),
        };
    }
};

//Buscar producto por Id
const getProduct = async ({
    params,
    response,
}: {
    params: { id:string };
    response: any;
})=> {
    console.log(params.id);
    const product = await productos.findOne({ productId: params.id});

    if (product) {
        response.status = 200;
        response.body = {
            succes: true,
            data: product,
        };
    }else{
        response.status = 404;
        response.body = {
            success: false,
            msg: "Product not found",
        };
    }
};

// Agregar producto por Id
const addProduct = async ({
    request, 
    response,
}: {
    request: any;
    response: any;
}) => {
    try{
        if(!request.hasBody) {
            response.status = 404;
            response.body = {
                succes: false,
                msg: "No data",
            }
        }else {
            const body = await request.body();
            const product = await body.value;
            await productos.insertOne(product);
            response.status = 201;
            response.body = {
                success: true,
                data: product,
            };
        }
    }catch (err){
        response.body = {
            success: true,
            msg: err.toString(),
        };
    }
}

const updateProduct = async ({
    params,
    request,
    response,
}:{
    params: {id: string};
    request: any;
    response: any;
}) => {
    try{
        const body = await request.body();
        const inputProduct = await body.value;
        await productos.updateOne(
            {productId: params.id},
            {$set : { 
                name: inputProduct.name, 
                price: inputProduct.price,
                img: inputProduct.img,
                stock: inputProduct.stock,
            }}
        );
        const updateProduct = await productos.findOne({ productId: params.id });
        response.satuts = 200;
        response.body = {
            success: true,
            data: updateProduct,
        };
    }catch (err){
        response.body = {
            success: true,
            msg: err.toString(),
        }; 
    }
};


const deleteProduct = async ({
    params,
    response,
}: {
    params: { id: string };
    request: any,
    response: any,
}) => {
    try {
        await productos.deleteOne({ productId: params.id});
        response.status = 201;
        response.body = {
            success: true,
            msg: "Producto borrado",
        };
    }catch(err){
        response.body = {
            success: true,
            msg: err.toString(),
        }; 
    }
};

export {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} 