const sqlite3 = require('sqlite3').verbose();
const logColor = require('chalk');
const base = new sqlite3.Database('./dgestor.db');

function isInt(n) {
	return Number(n) === n && n % 1 === 0;
	
}

exports.verPerfil = function (idusuario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, titulo TEXT, estado INTEGER)", select);
	function select() {
		base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				 throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO perfiles VALUES (?, ?, ?, ?, ?, ?)");
					prepare.run(idusuario, 0, 0, 'Sin informacion', 'Sin titulo', 0);
					
					base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {
							let expT = Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2)).toString();
							let frameFactor = Math.trunc(Math.pow((Number(filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2));

							let nPorcent = (((Number(filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
							let xpstats = `${filas.xp - expT}/${frameFactor}`;
							
							let profile = {
								'id': filas.idusu,
								'nivel': filas.nivel,
								'puntos': filas.xp,
								'info': filas.info,
								'titulo': filas.titulo,
								'estado': filas.estado,
								'sigNivel': xpstats,
								'porcNivel': nPorcent
							}

							cb(profile);
						}
					});

				} else {
					
					let expT = Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2)).toString();
					let frameFactor = Math.trunc(Math.pow((Number(filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2));

					let nPercent = (((Number(filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
					let xpStats = `${filas.xp - expT}/${frameFactor}`;
					
					let profile = {
						'id': filas.idusu,
						'nivel': filas.nivel,
						'puntos': filas.xp,
						'info': filas.info,
						'titulo': filas.titulo,
						'estado': filas.estado,
						'sigNivel': xpStats,
						'porcNivel': nPercent
					}

					cb(profile);

				};
			};
		});
	};
};
exports.editTitulo = function (idusuario, texto, cb) {
	base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, titulo TEXT, estado INTEGER)", select);
	function select() {
		base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO perfiles VALUES (?, ?, ?, ?, ?, ?)", update);
					prepare.run(idusuario, 0, 0, 'Sin informacion', 'Sin titulo', 0);
					
					function update() {
						base.run(`UPDATE perfiles SET titulo = '${texto}' WHERE idusu =?`, [idusuario], function (error) {
							if (error) {
								throw logColor.red('ERROR:'+ error)

							} else {
								cb(true)

							}
						});
					}
					
				} else {
					base.run(`UPDATE perfiles SET titulo ='${texto}' WHERE idusu =?`, [idusuario], function (error) {
						if (error) {
							throw logColor.red('ERROR:' + error);

						} else {
							cb(true)

						}
					});
					

				};
			};
		});
	};
};
exports.editInfo = function (idusuario, texto, cb) {
	base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, titulo TEXT, estado INTEGER)", select);

	function select() {
		base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO perfiles VALUES (?, ?, ?, ?, ?, ?)", update);
					prepare.run(idusuario, 0, 0, 'Sin informacion', 'Sin titulo', 0);

					function update() {
						base.run(`UPDATE perfiles SET info = '${texto}' WHERE idusu =?`, [idusuario], function (error) {
							if (error) {
								throw logColor.red('ERROR:' + error)

							} else {
								cb(true)

							}
						});
					}

				} else {
					base.run(`UPDATE perfiles SET info ='${texto}' WHERE idusu =?`, [idusuario], function (error) {
						if (error) {
							throw logColor.red('ERROR:' + error)

						} else {
							cb(true)

						}
					});
				

				};
			};
		});
	};
};
exports.editPuntos = function (idusuario, num, cb) {

	base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, titulo TEXT, estado INTEGER)", select);

	function select() {
		base.get("SELECT * FROM perfiles WHERE idusu = ?", [idusuario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO perfiles VALUES (?, ?, ?, ?, ?, ?)", updateXP);
					prepare.run(idusuario, 0, 0, 'Sin informacion', 'Sin titulo', 0);

					function updateXP() {
						if (isNaN(num)) {
							console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número.'));
							
						} else {
							let numero = parseInt(num);
							let verificar = isInt(numero);
							if (verificar) {
								
									base.get("SELECT * FROM perfiles WHERE idusu = ?", [idusuario], function (err, fila) {
										if (err) {
											throw logColor.red('[ERROR]: ' + err);

										} else {
												
											let xpNivel = Math.floor(0.1 * Math.sqrt(fila.xp + 1));
											if (Number.isNaN(xpNivel)) {
												xpNivel = 0;
											}
											let acNivel = fila.nivel;

											if (xpNivel > acNivel) {
												base.run(`UPDATE perfiles SET xp = ${fila.xp + numero}, nivel = ${xpNivel} WHERE idusu = ${idusuario}`);
												
												let nivel = xpNivel;
												cb(true, nivel);
											} else {
												base.run(`UPDATE perfiles SET xp = ${fila.xp + numero}, nivel = ${xpNivel} WHERE idusu =?`, [idusuario], function (error) {
													if (error) {
														throw logColor.red('[ERROR]: ' + error);

													}
												});
											}
											
									};
								});
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número entero.'));
							}
							
						}
					}
			

				} else {
					if (isNaN(num)) {
					console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número.'));

					} else {
						let numero = parseInt(num);
						let verificar = isInt(numero);
						
						if (verificar) {
								
								base.get("SELECT * FROM perfiles WHERE idusu = ?", [idusuario], function (err, filas) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);

									} else {
										let xpNivel = Math.floor(0.1 * Math.sqrt(filas.xp + 1));
										if (Number.isNaN(xpNivel)) {
											xpNivel = 0;
										}
										
										let acNivel = filas.nivel;
									
										if (xpNivel > acNivel) {
											base.run(`UPDATE perfiles SET xp = ${filas.xp + numero}, nivel = ${xpNivel} WHERE idusu = ${idusuario}`);
											

											let nivel = xpNivel;
											cb(true, nivel);
											
										} else {
											base.run(`UPDATE perfiles SET xp = ${filas.xp + numero}, nivel = ${xpNivel} WHERE idusu =?`, [idusuario], function (error) {
												if (error) {
													throw logColor.red('[ERROR]: ' + error);

												} 
											});
										}
									}
							});

						} else {
							console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número entero.'));
						}

					}
					

				};
			};
		});
	};
}
exports.verTop = function (tipo, cantidad, cb) {
	base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, titulo TEXT, estado INTEGER)", select);
	
	function select() {
			if (tipo == 'puntos' || tipo == 'nivel') {
				let setList = `SELECT idusu as id, nivel, xp as puntos, estado FROM perfiles ORDER BY ${tipo} DESC LIMIT ${cantidad}`;
				base.all(setList, function (err, filas) {
					if (err) {
						throw logColor.red('[ERROR]: ' + err);

					} else {
						filas.forEach(function (fila, i) {
							cb(fila, i)

						})

					}
				})
			} else {
				console.log(logColor.red('[ERROR]: El tipo enviado para listar es incorrecto.'));
				
			}	
	}
}

exports.verReputacion = function (idusuario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS reps (idusu TEXT, rep INTEGER, estado INTEGER)", select);

	function select() {
		base.get("SELECT * FROM reps WHERE idusu = ?", [idusuario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO reps VALUES (?, ?, ?)");
					prepare.run(idusuario, 0, 0);
					

					base.get("SELECT * FROM reps WHERE idusu = ?", idusuario, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {

							if (filas.rep < 1) {
								
								let reps = {
									'id': filas.idusu,
									'cantidad': 0,
									'estado': filas.estado

								}
								cb(reps);
							} else {
								
								let reps = {
									'id': filas.idusu,
									'cantidad': filas.rep,
									'estado': filas.estado

								}
								cb(reps);
							}
						}
					});

				} else {
					base.get("SELECT * FROM reps WHERE idusu = ?", idusuario, function (err, filas) {
						if (err) {
							throw logColor.red('[ERROR]: ' + err);

						} else {

							if (filas.rep < 1) {
							
								let reps = {
									'id': filas.idusu,
									'cantidad': 0,
									'estado': filas.estado

								}
								cb(reps);
							} else {
								let reps = {
									'id': filas.idusu,
									'cantidad': filas.rep,
									'estado': filas.estado

								}
								cb(reps);
							}

						}
					});
				
				};
			}

		})
	}
}
exports.editReputacion = function (idusuario, num, cb) {
	base.run("CREATE TABLE IF NOT EXISTS reps (idusu TEXT, rep INTEGER, estado INTEGER)", select);
	function select() {
		base.get("SELECT * FROM reps WHERE idusu = ?", [idusuario], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {
					let prepare = base.prepare("INSERT INTO reps VALUES (?, ?, ?)", updateRep);
					prepare.run(idusuario, 0, 0);
					

					function updateRep() {
						if (isNaN(num)) {
							console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número.'));
							
						} else {
							let numero = parseInt(num);
							let verificar = isInt(numero);
							if (verificar) {

								base.get("SELECT * FROM reps WHERE idusu = ?", [idusuario], function (err, fila) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);

									} else {

											if (fila.rep < 1) {
												base.run(`UPDATE reps SET rep = ${numero}  WHERE idusu =?`, [idusuario], function (error) {
													if (error) {
														throw logColor.red('[ERROR]: ' + error);

													} else {
													
														cb(this.changes)
													};
												});
											} else {
												base.run(`UPDATE reps SET rep = ${numero + fila.rep} WHERE idusu =?`, [idusuario], function (error) {
													if (error) {
														throw logColor.red('[ERROR]: ' + error);

													} else {
														
														cb(this.changes)
													};
												});
											}
									};
								});
							} else {
								console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número entero.'));
							}

						}
					}
					
				} else {
					if (isNaN(num)) {
						console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número.'));

					} else {
						let numero = parseInt(num);
						let verificar = isInt(numero);

						if (verificar) {

							base.get("SELECT * FROM reps WHERE idusu = ?", [idusuario], function (err, filas) {
								if (err) {
									throw logColor.red('[ERROR]: ' + err);

								} else {
								
												if (filas.rep < 1) {
													base.run(`UPDATE reps SET rep = ${numero}  WHERE idusu =?`, [idusuario], function (error) {
														if (error) {
															throw logColor.red('[ERROR]: ' + error);

														} else {
															
															cb(this.changes)
														};
													});
												} else {
													base.run(`UPDATE reps SET rep = ${numero + filas.rep} WHERE idusu =?`, [idusuario], function (error) {
														if (error) {
															throw logColor.red('[ERROR]: ' + error);

														} else {
														
															cb(this.changes)
														};
													});
												}
									}
							});

						} else {
							console.log(logColor.red('[ERROR]: Ups... ' + num + ' no es un número entero.'));
							
						}

					}
					

				};
			};
		});
		
	}
}
exports.verFondos = function (idusuario, cb) {
		base.run("CREATE TABLE IF NOT EXISTS fondos (idusu TEXT, bgPrincipal TEXT, bgSegundario TEXT, estado INTEGER)", select);

		function select() {
				base.get("SELECT * FROM fondos WHERE idusu = ?", [idusuario], function (err, filas) {
					if (err) {
						throw logColor.red('[ERROR]: ' + err);

					} else {
							if (!filas) {
								let prepare = base.prepare("INSERT INTO fondos VALUES (?, ?, ?, ?)");
								prepare.run(idusuario, null, null, 0);
								
								base.get("SELECT * FROM fondos WHERE idusu = ?", idusuario, function (err, filas) {
									if (err) {
										 throw logColor.red('[ERROR]: ' + err);

									} else {
										let fondos = {
											'id': filas.idusu,
											'fonPrincipal': filas.bgPrincipal,
											'fonSecundario': filas.bgSegundario,
											'estado': filas.estado

										}
										cb(fondos);
									}
								})
							} else {
								base.get("SELECT * FROM fondos WHERE idusu = ?", idusuario, function (err, filas) {
									if (err) {
										throw logColor.red('[ERROR]: ' + err);

									} else {
										let fondos = {
											'id': filas.idusu,
											'fonPrincipal': filas.bgPrincipal,
											'fonSecundario': filas.bgSegundario,
											'estado': filas.estado

										}
										cb(fondos);
									}
								})
							}
					}
				})
		}
}
exports.editFondo = function (idusuario, dato, cb) {
		base.run("CREATE TABLE IF NOT EXISTS fondos (idusu TEXT, bgPrincipal TEXT, bgSegundario TEXT, estado INTEGER)", select);

		function select() {
			base.get("SELECT * FROM fondos WHERE idusu = ?", [idusuario], function (err, filas) {
				if (err) {
					throw logColor.red('[ERROR]: ' + err);

				} else {
					if(!filas){
							let prepare = base.prepare("INSERT INTO fondos VALUES (?, ?, ?, ?)", updateFs);
							prepare.run(idusuario, null, null, 0);
							
							function updateFs() {
									
										base.run(`UPDATE fondos SET bgPrincipal = '${dato}'  WHERE idusu =?`, [idusuario], function (error) {
											if (error) {
												throw logColor.red('[ERROR]: ' + error);

											} else {
												
												cb(true);
											};
										});		
							}
						
					} else {
						base.run(`UPDATE fondos SET bgPrincipal = '${dato}'  WHERE idusu =?`, [idusuario], function (error) {
							if (error) {
								throw logColor.red('[ERROR]: ' + error);

							} else {
								
								cb(true);
							};
						});
					}
				}
		})
	}
}
