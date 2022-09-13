
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import router from "./src/routes/routes.ts";
import {config} from "./devDeps.ts";

config({ export: true });

const PORT = Number(Deno.env.get("PORT"));

const app = new Application();

app.use(router.routes())
app.use(router.allowedMethods())


await app.listen({ port: PORT });
console.log(`Servidor escuchando en el puerto ${PORT}`);
