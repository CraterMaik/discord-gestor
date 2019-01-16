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
+ Gestion de Cooldowns.

## Documentación
> [discord-gestor documentación](https://dg.portalmybot.com/)



## Ejemplo de uso

### MODULO PERFILES
```js
// Referenciar discord-gestor como dgestor (es opcional, solo para el ejemplo).
const dgestor = require('discord-gestor');
​
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


### MODULO ECONOMIA
```js
// Referenciar discord-gestor como dgestor (es opcional, solo para el ejemplo).
const dgestor = require('discord-gestor');

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

### MODULO UTILIDAD
```js
// Referenciar discord-gestor como dgestor (es opcional, solo para el ejemplo).
const dgestor = require('discord-gestor');

// El parametro (resp) retorna la respuesta como 
// dato booleano (verdadero) o (false) del
// usuario con el id: '123456'
​
// El parametro (tiempo) retorna los datos del tiempo que resta
// del cooldown del usuario
dgestor.utilidad.agregarCooldown('ping', '123456', {minutos: 2}, (resp, tiempo) =>{
	if (resp) {
		console.log('SI PUEDE USAR EL COMANDO');

	} else {
		console.log('NO PUEDE USAR EL COMANDO');
		console.log('FALTAN: ' + tiempo.horas + ' horas, ' + tiempo.minutos + ' minutos, ' + tiempo.segundos + ' segundos.');
		
	}
})
//Propiedades de retorno:
// horas 
// minutos
// segundos

// entre otros.. 
// (Vea todas la propiedades y funciones en la documentación.)
```