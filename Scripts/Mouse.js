class Mouse
{
	constructor( gfx )
	{
		const canv = document.getElementById( "canv" )
		
		this.down = false
		this.x = 0
		this.y = 0
		const self = this
		
		canv.addEventListener( "mousedown",function() { self.down = true } )
		canv.addEventListener( "mouseup",function() { self.down = false } )
		canv.addEventListener( "mousemove",function( event )
		{
			const rect = canv.getBoundingClientRect()
			const root = document.documentElement
			self.x = event.clientX - rect.left - root.scrollLeft
			self.y = event.clientY - rect.top - root.scrollTop
			
			self.x = Math.floor( self.x / gfx.scale )
			self.y = Math.floor( self.y / gfx.scale )
		} )
	}
}