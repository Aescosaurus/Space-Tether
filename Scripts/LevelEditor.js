class LevelEditor
{
	constructor()
	{
		this.open = false
		
		this.tileTypes =
		[
			0,1,2,3,4,'s','w','l','m','p','e','r','c','f'
		]
		this.tileSprs =
		[
			new Sprite( "Images/Sky" ),
			new Sprite( "Images/Wall" ),
			new Sprite( "Images/GhostTile" ),
			new Sprite( "Images/MoonrockTile" ),
			new Sprite( "Images/NotSky" ),
			new Sprite( "Images/Spike" ),
			new Sprite( "Images/Switch0" ),
			new Sprite( "Images/LaserBase" ),
			new Sprite( "Images/MovableRock" ),
			new Sprite( "Images/PlayerLeft0" ),
			new Sprite( "Images/ExitSprLE" ),
			new Sprite( "Images/Lever0" ),
			new Sprite( "Images/Critter0" ),
			new Sprite( "Images/FloatyBlock" ),
		]
		
		this.tileSize = 8
		this.width = 128 / this.tileSize
		this.height = 72 / this.tileSize
		this.tileGrid = []
		for( let i = 0; i < this.width * this.height; ++i )
		{
			this.tileGrid.push( 0 )
		}
		
		this.curTile = 0
		this.curX = 0
		this.curY = 0
		
		this.canDownload = false
	}
	
	Update( mouse,kbd )
	{
		for( let i = 0; i < this.tileTypes.length; ++i )
		{
			// if( kbd.KeyDown( ( i + 1 ).toString() ) )
			if( kbd.KeyDown( this.tileTypes[i].toString().toUpperCase() ) )
			{
				this.curTile = i
			}
		}
		
		this.curX = Math.floor( mouse.x / this.tileSize )
		this.curY = Math.floor( mouse.y / this.tileSize )
		
		if( mouse.down )
		{
			this.SetTile( this.curX,this.curY,this.curTile )
		}
		
		if( kbd.KeyDown( 'B' ) )
		{
			if( this.canDownload ) this.Download()
			this.canDownload = false
		}
		else this.canDownload = true
	}
	
	Draw( gfx )
	{
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				gfx.DrawSprite( x * this.tileSize,y * this.tileSize,
					this.tileSprs[0] )
				
				gfx.DrawSprite( x * this.tileSize,y * this.tileSize,
					this.tileSprs[this.GetTile( x,y )] )
			}
		}
		
		gfx.DrawSprite( this.curX * this.tileSize,this.curY * this.tileSize,
			this.tileSprs[this.curTile] )
	}
	
	SetTile( x,y,t )
	{
		this.tileGrid[y * this.width + x] = t
	}
	
	GetTile( x,y )
	{
		return( this.tileGrid[y * this.width + x] )
	}
	
	Download()
	{
		let text = ""
		text += ",\n\t{\n"
		text += "\t\ttethers: 5,\n"
		text += "\t\tlevel:\n"
		text += "\t\t[\n"
		for( let y = 0; y < this.height; ++y )
		{
			text += "\t\t\t\""
			for( let x = 0; x < this.width; ++x )
			{
				text += this.tileTypes[this.GetTile( x,y )]
			}
			text += "\",\n"
		}
		text += "\t\t]\n"
		text += "\t}"
		
		const link = document.createElement( "a" )
		link.setAttribute( "href","data:text/plain;charset=utf-8," + encodeURIComponent( text ) )
		link.setAttribute( "download","level.txt" )
		
		document.body.appendChild( link )
		link.click()
		document.body.removeChild( link )
	}
}