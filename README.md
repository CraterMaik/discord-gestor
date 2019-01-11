# Discord Gestor

> discord gestor es un modulo para gestionar y administrar datos de sqlite a través de metodos funcionales muy fácilmente, 100% en español.

[![NPM](https://nodei.co/npm/discord-gestor.png)](https://nodei.co/npm/discord-gestor/)

## Instalación

```
$ npm install --save discord-gestor
```

## Algunas Caracteristicas

+ Sistema de economía.
+ Sistema de niveles.
+ Gestión de tiendas.
+ Gestión de inventarios.


## Documentación
> [discord-gestor documentación](https://dg.portalmybot.com/)



## Ejemplo de uso

### .verPerfil()
```js
// Referenciar discord-gestor como dgestor (es opcional, solo para el ejemplo).
const dgestor = require('discord-gestor');
​
// Usando el modulo perfil

// El parametro (datos) optiene los datos de retorno del
// usuario solicitado con el id: '123456'.
dgestor.perfil.verPerfil('123456', (datos) => {
    console.log('Tengo: '+ datos.puntos + ' puntos.');
    console.log('Nivel: ' + datos.nivel);
    console.log('Porcentaje al siguiente nivel: '+ datos.porcNivel +'%');
    
});

//Propiedades de retorno:
// id 
// nivel
// puntos
// porcNivel

// entre otros..
// (Vea todas la propiedades y funciones en la documentación.)
```


### .verMonedas()
```js
// Referenciar discord-gestor como dgestor (es opcional, solo para el ejemplo).
const dgestor = require('discord-gestor');

// Usando el modulo economia

// El parametro (monedas) optiene los datos de retorno del
// usuario solicitado con el id: '123456'.
​
dgestor.economia.verMonedas('123456', (monedas) => {
    console.log('Tienes: '+ monedas.cantidad +' monedas.');
    
});

//Propiedades de retorno:
// id 
// cantidad

// entre otros.. 
// (Vea todas la propiedades y funciones en la documentación.)
```