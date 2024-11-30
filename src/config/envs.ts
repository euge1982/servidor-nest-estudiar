//Configuramos las variables de entorno

//Este archivo se encarga d e manejar las variables de entorno

import * as joi from 'joi';   //Libreria para validar datos,aca seusa para definir y validar las variables de entorno
import * as dotenv from 'dotenv';   //Libreria para manejar las variables de entorno

//Cargamos las variables de entorno
dotenv.config();

//Definimos la estructura de las variables
interface EnvVars {   //Es una interfaz que describe la estructura de las variables de entorno
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
}

//Configuramos el schema de JOI
const envsSchema = joi   //envsSchema define las reglas para las variables de entorno
    .object({
        PORT: joi.number().required(),   //Se le da tipo y que es requerido
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().required(),
    })
    .unknown(true);   //Indica que se permiten variables desconocidas

//Se valida, puede devolver un error o las variables
const { error, value} = envsSchema.validate(process.env);

//Si hay error, se corta la ejecucion del servidor y se muestra el mensaje de error
if (error) throw new Error(`Config validation error: ${error.message}`);

//si vino el valor, lo guardamos en una variable que va a ser del tipo EnvVars
const envVars: EnvVars = value;

//Exportamos las variables en un objeto
export const envs = {
    PORT: envVars.PORT,
    DATABASE_URL: envVars.DATABASE_URL,
    JWT_SECRET: envVars.JWT_SECRET
};