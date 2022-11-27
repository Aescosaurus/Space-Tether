class Keyboard
{
	constructor()
	{
		this.keyMap = []
		const self = this
		
		onkeydown = onkeyup = function( event )
		{
			self.keyMap[event.keyCode] = ( event.type == "keydown" )
		}
	}
	
	KeyDown( key )
	{
		if( typeof( key ) == "string" ) key = key.charCodeAt( 0 )
		
		return( this.keyMap[key] )
	}
}