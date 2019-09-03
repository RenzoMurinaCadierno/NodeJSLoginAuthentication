/************** EXTRA SERVER CONFIGS (cookies, ip, port) **************/

const COOKIE_EXPIRATION = 60000
const IP = process.env.IP | "127.0.0.1"
const PORT = process.env.PORT | 8080

module.exports = {
	COOKIE_EXPIRATION,
	IP,
	PORT
}
