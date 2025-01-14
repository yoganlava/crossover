const { checkboxTrue } = require( '../config/utils' )
const preferences = require( './preferences' ).init()
const windows = require( './windows' )

const notification = options => {

	if ( checkboxTrue( preferences.value( 'app.notify' ), 'notify' ) ) {

		windows.win.webContents.send( 'notify', options )

	}

}

module.exports = notification
