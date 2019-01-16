const sqlite3 = require('sqlite3').verbose();
const logColor = require('chalk');
const base = new sqlite3.Database('./discorows.sqlite');

exports.agregarCooldown = function (comando, idusuario, tiempo, cb) {
	base.run("CREATE TABLE IF NOT EXISTS cooldowns (idusu TEXT, comando TEXT, tiempo TEXT, estado INTEGER)", select);

	function select() {
		let cmd = comando.toLowerCase();

		base.get("SELECT * FROM cooldowns WHERE idusu = ? AND comando = ?", [idusuario, cmd], function (err, filas) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err);

			} else {
				if (!filas) {

					let prepare = base.prepare("INSERT INTO cooldowns VALUES (?, ?, ?, ?)", update);
					prepare.run(idusuario, cmd, Date.now(), 0);

					function update() {
						cb(true)
					}

				} else {

					let hh, mm, ss;

					if (!tiempo.horas) {
						hh = 0;

					} else {
						hh = (parseInt(tiempo.horas) * 3600000);

					}

					if (!tiempo.minutos) {
						mm = 0;

					} else {
						mm = (parseInt(tiempo.minutos) * 60000);

					}

					if (!tiempo.segundos) {
						ss = 0;

					} else {
						ss = parseInt(tiempo.segundos) * 1000;

					}

					let totalpre = hh + mm + ss;

					let time = totalpre;
					let total = time + parseInt(filas.tiempo);

					if (total < Date.now()) {

						base.run(`UPDATE cooldowns SET tiempo = ${Date.now()} WHERE idusu=? AND comando=?`,
							[filas.idusu, filas.comando],
							function (err) {
								if (err) {
									throw logColor.red('[ERROR]: ' + error);
								} else {
									cb(true)

								}
							})

					} else {

						let cdTiempo = Math.abs((Date.now() - (parseInt(filas.tiempo) + time)));

						let tiempoMili = cdTiempo;
						let segundos = parseInt(tiempoMili = tiempoMili / 1000) % 60;
						let minutos = parseInt(tiempoMili = tiempoMili / 60) % 60;
						let horas = parseInt(tiempoMili = tiempoMili / 60) % 24;

						let tiempo = {
							'horas': horas,
							'minutos': minutos,
							'segundos': segundos

						};
						verificar = false
						cb(verificar, tiempo);

					}

				}

			}

		});
	}
}
exports.removerCooldown = function (comando, idusuario, cb) {
	base.run("CREATE TABLE IF NOT EXISTS cooldowns (idusu TEXT, comando TEXT, tiempo TEXT, estado INTEGER)", select);

	function select() {
		base.run(`DELETE FROM cooldowns WHERE idusu=? AND comando=?`, [idusuario, comando], function (err) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err.message);
			} else {

				cb(this.changes)
			}
		})
	}
}

exports.resetCooldown = function (cb) {
	base.run("CREATE TABLE IF NOT EXISTS cooldowns (idusu TEXT, comando TEXT, tiempo TEXT, estado INTEGER)", select);

	function select() {
		base.run(`DELETE FROM cooldowns `, function (err) {
			if (err) {
				throw logColor.red('[ERROR]: ' + err.message);
			} else {

				cb(this.changes)
			}
		})
	}
}