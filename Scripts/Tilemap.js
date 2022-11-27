class Tilemap
{
	constructor( gfx,tutHandler )
	{
		this.tiles = []
		this.tileSize = 8
		this.width = gfx.scrWidth / this.tileSize
		this.height = gfx.scrHeight / this.tileSize
		
		this.exitLoc = { x: 0,y: 0 }
		this.playerLoc = { x: 0,y: 0 }
		this.spikeLocs = []
		this.switchLocs = []
		this.laserLocs = []
		this.moveRockLocs = []
		this.leverLocs = []
		this.critterLocs = []
		this.floatyLocs = []
		
		this.tileSprs =
		[
			new Sprite( "Images/Sky" ),
			new Sprite( "Images/Wall" ),
			new Sprite( "Images/GhostTile" ),
			new Sprite( "Images/MoonrockTile" ),
			new Sprite( "Images/Sky" ), // Movable rock
		]
		
		// for( let y = 0; y < this.height; ++y )
		// {
		// 	for( let x = 0; x < this.width; ++x )
		// 	{
		// 		let col = "#"
		// 		for( let i = 0; i < 6; ++i ) col += Math.floor( Math.random() * 9 )
		// 		this.tiles.push( col )
		// 	}
		// }
		this.tutHandler = tutHandler
		
		// this.curLevel = levels.length - 1
		// this.curLevel = 24
		this.curLevel = 0
		this.LoadLevel()
	}
	
	Draw( gfx )
	{
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				// let tileCol = "black"
				// const c = this.GetTile( x,y )
				// 
				// if( c == 0 ) tileCol = "black"
				// else if( c == 1 ) tileCol = "lightgray"
				// 
				// 
				// gfx.DrawRect( x * this.tileSize,y * this.tileSize,
				// 	this.tileSize,this.tileSize,tileCol )
				gfx.DrawSprite( x * this.tileSize,y * this.tileSize,
					this.tileSprs[this.GetTile( x,y )] )
			}
		}
	}
	
	LoadLevel()
	{
		this.tutHandler.LoadTutList( levels[this.curLevel].tuts )
		
		const mapData = levels[this.curLevel].level
		
		this.tiles = []
		
		this.spikeLocs.length = 0
		this.switchLocs.length = 0
		this.laserLocs.length = 0
		this.moveRockLocs.length = 0
		this.leverLocs.length = 0
		this.critterLocs.length = 0
		this.floatyLocs.length = 0
		
		for( let i = 0; i < mapData.length; ++i )
		{
			for( let j = 0; j < mapData[i].length; ++j )
			{
				let tile = mapData[i][j]
				const curPos = { x: j,y: i }
				if( tile == 'e' )
				{
					tile = 0
					this.exitLoc = curPos
				}
				else if( tile == 'p' )
				{
					tile = 0
					this.playerLoc = curPos
				}
				else if( tile == 's' )
				{
					tile = 0
					this.spikeLocs.push( curPos )
				}
				else if( tile == 'w' )
				{
					tile = 0
					this.switchLocs.push( curPos )
				}
				else if( tile == 'l' )
				{
					tile = 0
					this.laserLocs.push( curPos )
				}
				else if( tile == 'm' )
				{
					tile = 4 // not 0
					this.moveRockLocs.push( curPos )
				}
				else if( tile == 'r' )
				{
					tile = 0
					this.leverLocs.push( curPos )
				}
				else if( tile == 'c' )
				{
					tile = 0
					this.critterLocs.push( curPos )
				}
				else if( tile == 'f' )
				{
					tile = 4 // not 0
					this.floatyLocs.push( curPos )
				}
				else
				{
					tile = parseInt( tile )
				}
				this.tiles.push( tile )
			}
		}
	}
	
	SetTile( x,y,val )
	{
		this.tiles[y * this.width + x] = val
	}
	
	SetTileWorld( worldX,worldY,val )
	{
		this.SetTile( Math.floor( worldX / this.tileSize ),
			Math.floor( worldY / this.tileSize ),
			val )
	}
	
	// Get tile in tile coordinates (16x9).
	GetTile( x,y )
	{
		if( y < 0 || y >= this.height ) return( -1 )
		else if( x < 0 || x >= this.width )
		{
			return( -1 )
		}
		else return( this.tiles[y * this.width + x] )
	}
	
	// Get tile in world coordinates (128x72).
	GetTileWorld( worldX,worldY )
	{
		return( this.GetTile( Math.floor( worldX / this.tileSize ),
			Math.floor( worldY / this.tileSize ) ) )
	}
}