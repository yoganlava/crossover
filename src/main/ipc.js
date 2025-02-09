const { ipcMain } = require( 'electron' )
const autoUpdate = require( './auto-update' )
const crossover = require( './crossover' )
const preferences = require( './preferences' ).init()
const helpers = require( './helpers' )
const log = require( './log' )
const reset = require( './reset' )
const set = require( './set' )
const sound = require( './sound' )
const windows = require( './windows' )

const init = () => {

	/* IP Communication */
	ipcMain.on( 'log', ( _event, arg ) => {

		log.info( arg )

	} )

	ipcMain.on( 'error', ( event, arg ) => {

		log.error( arg )

	} )

	ipcMain.on( 'get_crosshairs', async _ => {

		// Setup crosshair chooser, must come before the check below
		if ( windows.chooserWindow ) {

			windows.chooserWindow.webContents.send( 'load_crosshairs', {
				crosshairs: await helpers.getCrosshairImages(),
				current: preferences.value( 'crosshair.crosshair' ),
			} )

		}

	} )

	ipcMain.on( 'close_chooser', _ => {

		windows.hideChooserWindow()

	} )

	ipcMain.on( 'close_window', event => {

		// Close a shadow window
		windows.closeShadow( event.sender.id )

	} )

	ipcMain.on( 'center_window', () => {

		log.info( 'Center window' )
		sound.play( 'CENTER' )
		windows.center()

	} )

	ipcMain.on( 'focus_window', async _ => {

		await windows.init()
		windows.win.focus()

	} )

	ipcMain.on( 'open_chooser', _ => {

		crossover.openChooserWindow()

	} )

	ipcMain.on( 'open_settings', _ => {

		crossover.openSettingsWindow()

	} )

	ipcMain.on( 'save_custom_image', ( event, arg ) => {

		log.info( `Setting custom image: ${arg}` )
		set.custom( arg )

	} )

	ipcMain.on( 'save_crosshair', ( event, arg ) => {

		crossover.changeCrosshair( arg )

	} )

	ipcMain.on( 'update_and_restart', () => {

		autoUpdate.install()

	} )

	ipcMain.on( 'reset_preferences', ( _event, _arg ) => {

		log.info( 'RESET' )
		reset.allPreferences()

	} )

	ipcMain.on( 'quit', () => {

		crossover.quit()

	} )

	// Used for testing
	ipcMain.on( 'move_window', arg => {

		windows.moveWindow( arg )

	} )

	ipcMain.on( 'play_sound', arg => {

		sound.play( arg )

	} )

	ipcMain.on( 'set_preference', arg => {

		if ( arg.key && arg.value ) {

			preferences.value( arg.key, arg.value )

		}

	} )

	// ipcMain.handle( 'invoke_test', async ( event, arg ) => {
	// 	console.log( 'invoke_test', arg )
	// 	return 'ok'
	// } )

}

const ipc = {
	init,
}
module.exports = ipc
