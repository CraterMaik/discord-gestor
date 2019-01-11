const sqlite3 = require('sqlite3').verbose();
const logColor = require('chalk');
const base = new sqlite3.Database('./dgestor.db');

function isInt(n) {
	return Number(n) === n && n % 1 === 0;
}

exports.verMonedas = function (idusuario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS monedas (idusu TEXT, cantidad INTEGER, estado INTEGER)", select);
	function select() {
		base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)");
					prepare.run(idusuario, 0, 0);
					
					base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							if (filas.cantidad < 1) {
									
									let monedas = {
										'id': filas.idusu,
										'cantidad': 0,
										'estado': filas.estado
									}
									cb(monedas)
							} else {
									let monedas = {
										'id': filas.idusu,
										'cantidad': filas.cantidad,
										'estado': filas.estado
									}
									cb(monedas)
							}
						}
					});
					
				} else {
					base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							if (filas.cantidad < 1) {
								
								let monedas = {
									'id': filas.idusu,
									'cantidad': 0,
									'estado': filas.estado
								}
								cb(monedas)
							} else {
								let monedas = {
									'id': filas.idusu,
									'cantidad': filas.cantidad,
									'estado': filas.estado
								}
								cb(monedas)
							}
						}
					});
					
				}
			}

		});
	}
}
exports.editMonedas = function (idusuario, cantidad, cb) {
	base.run("CREATE TABLE IF NOT EXISTS monedas (idusu TEXT, cantidad INTEGER, estado INTEGER)", select);

	function select() {
		base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)", updateMo);
					prepare.run(idusuario, 0, 0);
					
					function updateMo() {
						if (isNaN(cantidad)) {
							console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.'));

						} else {
							let numero = parseInt(cantidad);
							let verificar = isInt(numero);
							if (verificar) {

								base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, fila) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);

									} else {

										if (fila.cantidad < 0) {
											base.run(`UPDATE monedas SET cantidad = ${numero}  WHERE idusu =?`, [idusuario], function (error) {
												if (error) {
													throw logColor.red('[ERROR]: ' + error);

												} else {

													base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, filasn) {
														if (error) {
															throw logColor.red('[ERROR]: ' + error);

														} else {
															if (filasn.cantidad < 0) {
																cb(0)
															} else {
																cb(filasn.cantidad)
															}
														}

													})
												};
											});
										} else {
											base.run(`UPDATE monedas SET cantidad = ${numero + fila.cantidad} WHERE idusu =?`, [idusuario], function (error) {
												if (error) {
													throw logColor.red('[ERROR]: ' + error);

												} else {

													base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, filasn) {
														if (error) {
															throw logColor.red('[ERROR]: ' + error);

														} else {
															if (filasn.cantidad < 0) {
																cb(0)
															} else {

																cb(filasn.cantidad)
															}
														}

													})
												};
											});
										}
									};
								});
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));
							}

						}
					}
					

				} else {
					if (isNaN(cantidad)) {
						console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.'));

					} else {
						let numero = parseInt(cantidad);
						let verificar = isInt(numero);

						if (verificar) {

							base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, filas) {
								if (err) {
									throw logColor.red('[ERROR]: ' + err);

								} else {

									if (filas.cantidad < 0) {
											
										base.run(`UPDATE monedas SET cantidad = ${numero}  WHERE idusu =?`, [idusuario], function (error) {
											if (error) {
												throw logColor.red('[ERROR]: ' + error);

											} else {
											
												base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, filasn) {
													if (error) {
														throw logColor.red('[ERROR]: ' + error);

													} else {
														if (filasn.cantidad < 0) {
															cb(0)
														} else {
															cb(filasn.cantidad)
														}
													}
													
												})
												
											};
										});
									} else {
										
										base.run(`UPDATE monedas SET cantidad = ${numero + filas.cantidad} WHERE idusu =?`, [idusuario], function (error) {
											if (error) {
												throw logColor.red('[ERROR]: ' + error);

											} else {

												base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, filasn) {
													if (error) {
														throw logColor.red('[ERROR]: ' + error);

													} else {
														if (filasn.cantidad < 0) {
															cb(0)
														} else {
															
															cb(filasn.cantidad)
														}
													}

												})
												
											};
										});
									}
								}
							});

						} else {
							console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));
						}

					}
					
				};
			};
		});
	}
}
exports.verTop = function (cantidad, cb) {
	base.run("CREATE TABLE IF NOT EXISTS monedas (idusu TEXT, cantidad INTEGER, estado INTEGER)", select);

	function select() {
			let cantidadLista = parseInt(cantidad);
			let setList = `SELECT idusu as id, cantidad FROM monedas ORDER BY cantidad DESC LIMIT ${cantidadLista}`;
			base.all(setList, function (err, filas) {
				if (err) {
					throw logColor.red('[ERROR]: ' + err);

				} else {
					filas.forEach(function (fila, i) {
						cb(fila, i)

					})

				}
			})
	}
}
exports.monedasDiarias = function (idusuario, cantidad, cb) {
	let verificar;
	base.run("CREATE TABLE IF NOT EXISTS diario (idusu TEXT, cooldown TEXT, estado INTEGER)", select);
		function select() {
			base.get("SELECT * FROM diario WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO diario VALUES (?, ?, ?)", updateDa);
					prepare.run(idusuario, '0', 0);

					function updateDa() {
						if (isNaN(cantidad)) { 
							console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.'));

						} else {
							let numero = parseInt(cantidad);
							let verificar = isInt(numero);
							if (verificar) {
								base.get("SELECT * FROM diario WHERE idusu = ?", [idusuario], function (err, fila) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);
									} else {
										base.run(`UPDATE diario SET cooldown = ${Date.now()} WHERE idusu=?`,
										[idusuario], function (err) {
											if (err) {
												throw logColor.red('[ERROR]: ' + error);
											} else {
												base.run("CREATE TABLE IF NOT EXISTS monedas (idusu TEXT, cantidad INTEGER, estado INTEGER)");

												base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, fila) {
													if (err) {
														throw logColor.red('[ERROR]: ' + err);

													} else {
														if(!fila){
															
																	let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)");
																	prepare.run(idusuario, 0, 0);
																	
																	base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, fila_m) {
																		if (err) {
																			throw logColor.red('[ERROR]: ' + err);

																		} else {
																			base.run(`UPDATE monedas SET cantidad = ${numero + fila_m.cantidad} WHERE idusu =?`, [idusuario], function (error) {
																				if (error) {
																					throw logColor.red('[ERROR]: ' + error);

																				} else {
																					verificar = true;
																					cb(verificar);

																				};
																			});

																		}

																	});
															
														} else {
															base.run(`UPDATE monedas SET cantidad = ${numero + fila.cantidad} WHERE idusu =?`, [idusuario], function (error) {
																if (error) {
																	throw logColor.red('[ERROR]: ' + error);

																} else {
																	verificar = true;
																	cb(verificar);

																};
															});
														}
														
													}
												});
											}
										})
									}
								})
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));
							}
						}
					}
					
				} else {

					let timer = 86400000;
					let total = timer + parseInt(filas.cooldown);

					if (total < Date.now()) {
						
						if (isNaN(cantidad)) {
							console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.'));

						} else {
							let numero = parseInt(cantidad);
							let verificar = isInt(numero);
							if (verificar) {
										base.run(`UPDATE diario SET cooldown = ${Date.now()} WHERE idusu=?`,
											[idusuario],
											function (err) {
												if (err) {
													throw logColor.red('[ERROR]: ' + error);

												} else {
													base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, fila) {
														if (err) {
															throw logColor.red('[ERROR]: ' + err);

														} else {
															base.run(`UPDATE monedas SET cantidad = ${numero + fila.cantidad} WHERE idusu =?`, [idusuario], function (error) {
																if (error) {
																	throw logColor.red('[ERROR]: ' + error);

																} else {
																	verificar = true;
																	cb(verificar);

																};
															});
														}
													});
												}
											})
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));

							}
						}
						
					} else {
						let cdTiempo = Math.abs((Date.now() - (parseInt(filas.cooldown) + timer)));

						let tiempoMili = cdTiempo;
						let segundos = parseInt(tiempoMili = tiempoMili / 1000) % 60;
						let minutos = parseInt(tiempoMili = tiempoMili / 60) % 60;
						let horas = parseInt(tiempoMili = tiempoMili / 60) % 24;

						let tiempo = {
							'horas' : horas,
							'minutos': minutos,
							'segundos': segundos
						};

						verificar = false;
						cb(verificar, tiempo);

					}
					
				}
			}
		});

		}
}
exports.transferirMonedas = function (idusuario, idusuario_trans, cantidad, cb) {
	base.run("CREATE TABLE IF NOT EXISTS monedas (idusu TEXT, cantidad INTEGER, estado INTEGER)", select);

	function select() {
		base.get("SELECT * FROM monedas WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) { 
					let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)", updateTransfer);
					prepare.run(idusuario, 0, 0);
					
					function updateTransfer() {
						if (isNaN(cantidad)) {
							throw logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.');

						} else {
							let numero = parseInt(cantidad);
							let verificar = isInt(numero);
							if(numero < 1) return console.log(logColor.red('La cantidad debe a mayor a cero.'));
							
							if (verificar) {

								base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, fila) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);

									} else {

										if (numero < fila.cantidad) {
											base.run(`UPDATE monedas SET cantidad = ${fila.cantidad - numero}  WHERE idusu =?`, [idusuario], function (error) {
												if (error) {
													throw logColor.red('[ERROR]: ' + error);

												} else {
													
														base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario_trans], function (err, fila_tr) {
															if (err) {
																throw logColor.red('[ERROR]: ' + err);

															} else {
																if (!fila_tr) {
																	let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)", updateTransfer_n);
																	prepare.run(idusuario_trans, 0, 0);
																	function updateTransfer_n() {
																		base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario_trans], function (err, fila_tr_up) {
																			base.run(`UPDATE monedas SET cantidad = ${fila_tr_up.cantidad + numero}  WHERE idusu =?`, [idusuario_trans], function (error) {
																				if (error) {
																					throw logColor.red('[ERROR]: ' + error);

																				} else {
																					veriTransfer = true;
																					cb(veriTransfer);

																				}
																			})
																		})

																	}
																} else {
																	base.run(`UPDATE monedas SET cantidad = ${fila_tr.cantidad + numero}  WHERE idusu =?`, [idusuario_trans], function (error) {
																		if (error) {
																			throw logColor.red('[ERROR]: ' + error);

																		} else {
																			veriTransfer = true;
																			cb(veriTransfer);

																		}
																	})
																}
																
															}

														})
												};
											});
										} else {
											veriTransfer = false;
											cb(veriTransfer)
										
										}
									};
								});
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));

							}

						}
					}
					

				} else {
					if (isNaN(cantidad)) {
						console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número.'));

					} else {
						let numero = parseInt(cantidad);
						let verificar = isInt(numero);
						if (numero < 1) return console.log(logColor.red('La cantidad debe a mayor a 0.'));
						if (verificar) {

							base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario], function (err, fila) {
								if (err) {
									throw logColor.red('[ERROR]: ' + err);

								} else {

									if (numero < fila.cantidad) {
										base.run(`UPDATE monedas SET cantidad = ${fila.cantidad - numero}  WHERE idusu =?`, [idusuario], function (error) {
											if (error) {
												throw logColor.red('[ERROR]: ' + error);

											} else {

												base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario_trans], function (err, fila_tr) {
													if (err) {
														throw logColor.red('[ERROR]: ' + err);

													} else {
														if (!fila_tr) {
															let prepare = base.prepare("INSERT INTO monedas VALUES (?, ?, ?)", updateTransfer_n);
															prepare.run(idusuario_trans, 0, 0);

															function updateTransfer_n() {
																base.get("SELECT * FROM monedas WHERE idusu = ?", [idusuario_trans], function (err, fila_tr_up) {
																	base.run(`UPDATE monedas SET cantidad = ${fila_tr_up.cantidad + numero}  WHERE idusu =?`, [idusuario_trans], function (error) {
																		if (error) {
																			throw logColor.red('[ERROR]: ' + error);

																		} else {
																			veriTransfer = true;
																			cb(veriTransfer);

																		}
																	})
																})

															}
														} else {
															base.run(`UPDATE monedas SET cantidad = ${fila_tr.cantidad + numero}  WHERE idusu =?`, [idusuario_trans], function (error) {
																if (error) {
																	throw logColor.red('[ERROR]: ' + error);

																} else {
																	veriTransfer = true;
																	cb(veriTransfer);

																}
															})
														}
													}
												})
											};
										});
									} else {
										veriTransfer = false;
										cb(veriTransfer)
									
									}
								};
							});
						} else {
							console.log(logColor.red('[ERROR]: Ups... ' + cantidad + ' no es un número entero.'));
						}

					}
					
				}
			}
		})
	}

}
exports.crearTienda = function(nombreTienda, cb){
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)", select);

	function select() {
		let tienda = nombreTienda.toLowerCase();
		
		base.get("SELECT * FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO tiendas(nombreTienda, estado) VALUES (?, ?)", updateTienda);
					prepare.run(tienda, 0);

					function updateTienda() {
						base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, fila) {
							if (err) {
								throw logColor.red('[ERROR]: ' + err);

							} else {
								cb(fila)
								
							}
						})
					}

				} else {
						console.log(logColor.red('Ya existe una tienda registrada con el mismo nombre.'));
				}
			}
		});
	}

}
exports.agregarItems = function (nombreTienda, listaItems) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)", select);
	function select() {
		let tienda = nombreTienda.toLowerCase();

			base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas) {
				if (err) {
					throw logColor.red('[ERROR]: ' + err);

				} else {
					if (!filas) {
						console.log(logColor.red('La tienda con el nombre '+ tienda +' no existe.'));
						
					} else {
						listaItems.forEach(function (element) {
							let nombre = element.nombre.toLowerCase();
							let precio = parseInt(element.precio)
							base.get("SELECT * FROM items WHERE nombreItem =? AND idtienda =?", [nombre, filas.id], function (err, fila) {
								if (err) {
									throw logColor.red('[ERROR]: ' + err);
								} else {
									if(!fila){
										let prepare = base.prepare("INSERT INTO items(idtienda, nombreItem, precio, estado) VALUES (?, ?, ?, ?)");
										prepare.run(filas.id, nombre, precio, 0);
										
										
									}
								}
							})
						})
					}
				}
		});
	}
	
}
exports.editItem = function (nombreTienda, nombreItem, lista, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)", select);

	function select() {
		let item = nombreItem.toLowerCase();
		let tienda = nombreTienda.toLowerCase();
		

		base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas_t) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas_t) {
						console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
				} else {
				
					
					base.get("SELECT rowid as id, nombreItem as nombre, precio FROM items WHERE nombreItem = ?", [item], function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							if (!filas) {
								console.log(logColor.red('El item con el nombre ' + item + ' no existe.'));
							} else {
								let itemNuevo;
								let precioNuevo;

								if (!lista.precio) {
									precioNuevo = filas.precio
								} else {
									precioNuevo = parseInt(lista.precio)
								}

								if (!lista.nombre) {
									itemNuevo = filas.nombre
								} else {
									itemNuevo = lista.nombre.toLowerCase()
								}
							
								base.run(`UPDATE items SET nombreItem='${itemNuevo}', precio= ${precioNuevo}  WHERE nombreItem=? AND idtienda=?`, [filas.nombre, filas_t.id], function (err) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);
									} else {
									
										cb(true)
									}
								})

							}
						}
					})
				}


			}
		})
	}
	
}
exports.editTienda = function (nombreTienda, nuevoNombre, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)", select);
	function select() {
		
		let tienda = nombreTienda.toLowerCase();
		let nuevoTienda = nuevoNombre.toLowerCase();
		if (tienda === nuevoTienda) return console.log(logColor.red('El nombre de la tienda a editar no deben ser igual a la anterior.'));
		
		base.get("SELECT rowid as id FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
				} else {
					base.run(`UPDATE tiendas SET nombreTienda = '${nuevoTienda}' WHERE idtienda =?`, [filas.id], function (error) {
						if (error) {
							throw logColor.red('[ERROR]: ' + error);

						} else {
							if (this.changes) {
								cb(this.changes)
							} else {
								cb(null)
							}

						};
					});
				}
			}
		})
	}

}
exports.verTienda = function(nombreTienda, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)", select);

	function select() {
		let tienda = nombreTienda.toLowerCase();
		base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
				} else {
					let lista = `SELECT rowid as id, nombreItem as nombre, precio, estado FROM items WHERE idtienda = ${filas.id}`;
					base.all(lista, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							if (filas.length) {
								filas.forEach(function (fila, i) {
									cb(fila, i)

								})
							} else {
								cb(null)
							}
							
						}
					})
				}
			}
		});
		
	}
}
exports.listarTiendas = function (cb) {
	base.get("SELECT * FROM tiendas", function (err) {
		if (err) {
			throw logColor.red('[ERROR]: ' + err);

		} else {
			
				let lista = `SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas`;
				base.all(lista, function (err, filas) {
					if (err) {
						throw logColor.red('[ERROR]: ' + err);

					} else {
						filas.forEach(function (fila, i) {
							cb(fila, i)

						})

					}
				})
			
		}
	});
}
exports.eliminarTienda = function(nombreTienda, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)", select);

	function select() {
		let tienda = nombreTienda.toLowerCase();
		base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
				} else {
					base.run(`DELETE FROM items WHERE idtienda=?`, [filas.id], function (err) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err.message);
						} else {
							base.run(`DELETE FROM tiendas WHERE nombreTienda=?`, [filas.nombre], function (err) {
								if (err) {
									throw logColor.red('[ERROR]: ' + err.message);
								} else {
		
									cb(this.changes)
								}
							})
						}
					})
					
				}
			}
		})
	}
	
}
exports.eliminarItem = function (nombreTienda, nombreItem, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)", select);

	function select() {
		let item = nombreItem.toLowerCase();
		let tienda = nombreTienda.toLowerCase();
		base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, filas_t) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas_t) {
					console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
				} else {
					base.get("SELECT rowid as id, nombreItem as nombre FROM items WHERE nombreItem = ?", [item], function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							if (!filas) {
								console.log(logColor.red('El item con el nombre ' + item + ' no existe.'));
							} else {
								base.run(`DELETE FROM items WHERE nombreItem=? AND idtienda=?`, [filas.nombre, filas_t.id], function (err) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err.message);
									} else {
										cb(this.changes)

									}
								})

							}
						}
					})
				}
			}
		})
		
	}
}
exports.crearInventario = function (nombreInventario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)", select);
	function select() {
		let inventario = nombreInventario.toLowerCase();
		
		base.get("SELECT * FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: '+ err)
			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO inventarios(nombreInventario, estado) VALUES (?, ?)", updateInventario);
					prepare.run(inventario, 0);

					function updateInventario() {
							base.get("SELECT rowid as id, nombreInventario as nombre FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, fila) {
								
								if (err) {
									throw logColor.red('[ERROR]: ' + err);

								} else {
									cb(fila)

								}
							})
					}
				} else {
					console.log(logColor.red('Ya existe un inventario registrado con el mismo nombre.'));
				}
			}
		})
	}

}

exports.agregarItemsAInventario = function (idusuario, nombreTienda, nombreInventario, itemInfo, cb) {
	base.run("CREATE TABLE IF NOT EXISTS tiendas (idtienda INTEGER PRIMARY KEY, nombreTienda TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS items (iditem INTEGER PRIMARY KEY, idtienda INTEGER, nombreItem TEXT, precio INTEGER, estado INTEGER)");

	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS itemsInv (iditemInv INTEGER PRIMARY KEY, idinventario INTEGER, idusuario TEXT, nombreItem TEXT, cantidad INTEGER, estado INTEGER)", select);
	
	function select() {
		if (!itemInfo.nombre) return console.log(logColor.red('Debe ingresar el nombre del item a agregar'));
		let inventario = nombreInventario.toLowerCase();
		let item = itemInfo.nombre.toLowerCase();
		let tienda = nombreTienda.toLowerCase();
		base.get("SELECT rowid as id, nombreInventario as nombre, estado FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					console.log(logColor.red('El inventario con el nombre ' + inventario + ' no existe.'));
				} else {
						base.get("SELECT rowid as id, nombreTienda as nombre, estado FROM tiendas WHERE nombreTienda = ?", [tienda], function (err, fila_t) {
							if (err) {
								throw logColor.red('[ERROR]: ' + err);

							} else {
								if (!fila_t) {
									console.log(logColor.red('La tienda con el nombre ' + tienda + ' no existe.'));
								} else {

									base.get("SELECT * FROM items WHERE nombreItem =? AND idtienda =?", [item, fila_t.id], function (err, fila_it) {
											if (err) {
												throw logColor.red('[ERROR]: ' + err);

											} else {
												if (!fila_it) {
													console.log(logColor.red('El item con el nombre ' + item + ' no existe en la tienda.'));
												} else {
													base.get("SELECT * FROM itemsInv WHERE nombreItem =? AND idinventario =? AND idusuario=?", [item, filas.id, idusuario], function (err, fila) {
														if (err) {
															throw logColor.red('[ERROR]: ' + err);
														} else {
															if (!fila) {
																let cantidadI;

																if (!itemInfo.cantidad) {
																	cantidadI = 1;
																} else {
																	cantidadI = parseInt(itemInfo.cantidad);
																}

																let prepare = base.prepare("INSERT INTO itemsInv(idinventario, idusuario, nombreItem, cantidad, estado) VALUES (?, ?, ?, ?, ?)");
																prepare.run(filas.id, idusuario, item, cantidadI, 0);
																cb(true)

															}
														}
													})
												}
											}
									})

								}
							}
						})
						
				}
			}
			
		})
	}

}
exports.verInventario = function (idusuario, nombreInventario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS itemsInv (iditemInv INTEGER PRIMARY KEY, idinventario INTEGER, idusuario TEXT, nombreItem TEXT, cantidad INTEGER, estado INTEGER)", select);

	function select() {
		let inventario = nombreInventario.toLowerCase();
		base.get("SELECT rowid as id, nombreInventario as nombre, estado FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);
			} else {
				if (!filas) {
					console.log(logColor.red('El inventario con el nombre ' + inventario + ' no existe.'));

				} else {
					let lista = `SELECT rowid as id, nombreItem as nombre, cantidad, estado FROM itemsInv WHERE idinventario = ${filas.id} AND idusuario = ${idusuario}`;
				
					base.all(lista, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);
						} else {
							if (filas.length) {
								filas.forEach(function (fila, i) {
									cb(fila, i);

								})
							} else {
								cb(null)
							
							}
							
							
						}
					})
				}
			}
		})
	}
}
exports.editInventario = function (nombreInventario, nuevoNombre, cb) {
	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)", select);
	function select() {
		let inventario = nombreInventario.toLowerCase();
		let nuevoInventario = nuevoNombre.toLowerCase();

		if (inventario === nuevoInventario) return console.log(logColor.red('El nombre del inventario no deben ser iguales'));

		base.get("SELECT rowid as id FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);
			} else {
				if (!filas) {
					console.log(logColor.red('El inventario con el nombre ' + inventario + ' no existe.'));
				} else {
					base.run(`UPDATE inventarios SET nombreInventario = '${nuevoInventario}' WHERE idinventario =?`, [filas.id], function (error) {
						if (error) {
							throw logColor.red('[ERROR]: ' + error);
						} else {
							if (this.changes) {
								cb(this.changes)
							} else {
								cb(null)
							}
						
						}
					})
				}
			}
		})

	}
}

exports.editItemDeInventario = function (idusuario, nombreInventario, nombreItem, cantidad) {
	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)");
	base.run("CREATE TABLE IF NOT EXISTS itemsInv (iditemInv INTEGER PRIMARY KEY, idinventario INTEGER, idusuario TEXT, nombreItem TEXT, cantidad INTEGER, estado INTEGER)", select);

	function select() {
		let inventario = nombreInventario.toLowerCase();
		let item = nombreItem.toLowerCase();

		base.get("SELECT rowid as id, nombreInventario as nombre, estado FROM inventarios WHERE nombreInventario = ?", [inventario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					console.log(logColor.red('El inventario con el nombre ' + inventario + ' no existe.'));
				} else {
					base.get("SELECT * FROM itemsInv WHERE nombreItem =? AND idinventario =? AND idusuario=?", [item, filas.id, idusuario], function (err, fila) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);
						} else {
							if (!fila) {
								console.log(logColor.red('No se encontro el item '+ item +' en su inventario.'));

							} else {
								let cantidadI = parseInt(cantidad);
								base.run(`UPDATE itemsInv SET cantidad = ${fila.cantidad + cantidadI} WHERE nombreItem =? AND idinventario =? AND idusuario=?`, [item, filas.id, idusuario], 
								function (error) {
									if (error) {
										throw logColor.red('[ERROR]: ' + error);
									} 

								});

								
							}
							
						}
					})
				}
			}
		})


	}

}
exports.listarInventarios = function (cb) {
	base.run("CREATE TABLE IF NOT EXISTS inventarios (idinventario INTEGER PRIMARY KEY, nombreInventario TEXT, estado INTEGER)");
	base.get(`SELECT * FROM inventarios`, function (err) {
		if (err) {
			throw logColor.red('[ERROR]: '+ err)
		} else {
			
				let lista = `SELECT rowid as id, nombreInventario as nombre, estado FROM inventarios`;
				base.all(lista, function (err, filas) {
					if (err) {
						throw logColor.red('[ERROR]: ' + err);

					} else {
						filas.forEach(function (fila, i) {
							cb(fila, i)

						})

					}
				})
			
		}
	})
}