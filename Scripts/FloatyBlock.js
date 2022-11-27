class FloatyBlock
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		this.centerX = this.x + 4
		this.centerY = this.y + 4
		
		this.partHand = partHand
		
		this.drawDirs = []
		this.UpdateDirs()
		
		// floats up player and has slowing effect
		// lift tethers above
		// act like laser and be able to go in any direction based on blocked dirs
	}
	
	Update( player,tether )
	{
		// if( Random.Range( 0.0,1.0 ) < FloatyBlock.partSpawnChance )
		// {
		// 	this.partHand.CreateParticle( { x: this.x + Random.Range( 0,7 ),y: this.y - 1 },5,1 )
		// }
		
		for( let i in this.drawDirs )
		{
			const dist = this.drawDirs[i]
			if( dist > 0 && Random.Range( 0.0,1.0 ) < FloatyBlock.partSpawnChance )
			{
				const endLoc = { x: this.x,y: this.y }
				const cd = FloatyBlock.checkDirs[i]
				endLoc.x += cd.x * dist * this.tilemap.tileSize
				endLoc.y += cd.y * dist * this.tilemap.tileSize
				// gfx.DrawRectDim( this.x + 2,this.y + 2,
				// 	endLoc.x + Math.abs( cd.y ) * 6,endLoc.y + Math.abs( cd.x ) * 6,Laser.laserCol )
				
				// const partPos = {
				// 	x: Random.Range( this.x - Math.abs( cd.x ) * 4,this.x - Math.abs( cd.x ) * 4 ) + 4,
				// 	y: Random.Range( this.y - Math.abs( cd.y ) * 4,this.y - Math.abs( cd.y ) * 4 ) + 4 }
				const offsetMult = ( ( FloatyBlock.checkDirs[i].x > 0 || FloatyBlock.checkDirs[i].y > 0 ) ? 8 : 0 )
				const partPos = {
					x: this.x + cd.x * offsetMult + Math.abs( Random.Range( 0,cd.y * 7 ) ),
					y: this.y + cd.y * offsetMult + Math.abs( Random.Range( 0,cd.x * 7 ) )
				}
				this.partHand.CreateParticle( partPos,5,1,
					{ xVel: FloatyBlock.checkDirs[i].x,
					yVel: FloatyBlock.checkDirs[i].y,
					lifetime: ( 8 / ( 60 * 0.8 ) ) * ( dist - Math.sign( offsetMult ) ) * 60 } )
			}
		}
		
		const playerResult = this.EasyCheckOverlap( player )
		if( playerResult >= 0 )
		{
			player.x += FloatyBlock.checkDirs[playerResult].x * FloatyBlock.floatSpd
			player.y += FloatyBlock.checkDirs[playerResult].y * FloatyBlock.floatSpd
			player.yVel = 0.0
			player.tetherOverride = true
		}
		
		const tetherResult = this.EasyCheckOverlap( tether )
		if( tetherResult >= 0 && !tether.held )
		{
			tether.x += FloatyBlock.checkDirs[tetherResult].x * FloatyBlock.floatSpd
			tether.y += FloatyBlock.checkDirs[tetherResult].y * FloatyBlock.floatSpd
		}
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,FloatyBlock.spr )
		
		for( let i in this.drawDirs )
		{
			if( this.drawDirs[i] > 0 ) gfx.DrawSprite( this.x,this.y,FloatyBlock.dirSprs[i] )
		}
	}
	
	UpdateDirs()
	{
		this.drawDirs = [ 0,0,0,0 ]
		
		for( let i in FloatyBlock.checkDirs )
		{
			const curPos = { x: this.centerX,y: this.centerY }
			do
			{
				curPos.x += FloatyBlock.checkDirs[i].x * this.tilemap.tileSize
				curPos.y += FloatyBlock.checkDirs[i].y * this.tilemap.tileSize
				++this.drawDirs[i]
			}
			while( this.tilemap.GetTileWorld( curPos.x,curPos.y ) == 0 )
		}
		
		for( let i in this.drawDirs ) --this.drawDirs[i]
		
		if( this.drawDirs[1] > 0 ) ++this.drawDirs[1]
		if( this.drawDirs[3] > 0 ) ++this.drawDirs[3]
	}
	
	// Return int for which direction we overlapped with, -1 if no overlap
	EasyCheckOverlap( obj )
	{
		const xDiff = obj.x - this.centerX
		const yDiff = obj.y - this.centerY
		const tolerance = this.tilemap.tileSize * 0.5
		
		const absX = Math.abs( xDiff )
		const absY = Math.abs( yDiff )
		
		const up = absY < this.drawDirs[0] * this.tilemap.tileSize && yDiff < 0.0
		const down = absY < this.drawDirs[1] * this.tilemap.tileSize && yDiff > 0.0
		const left = absX < this.drawDirs[2] * this.tilemap.tileSize && xDiff < 0.0
		const right = absX < this.drawDirs[3] * this.tilemap.tileSize && xDiff > 0.0
		
		// return( ( absX < tolerance && ( up || down ) ) ||
		// 	( absY < tolerance && ( left || right ) ) ||
		// 	( absX < 4 && absY < 4 ) )
		if( absX < tolerance )
		{
			if( up ) return( 0 )
			else if( down ) return( 1 )
		}
		
		if( absY < tolerance )
		{
			if( left ) return( 2 )
			else if( right ) return( 3 )
		}
		
		return( -1 )
	}
}

FloatyBlock.spr = new Sprite( "Images/FloatyBlock" )
FloatyBlock.dirSprs =
[
	new Sprite( "Images/FloatyBlockUp" ),
	new Sprite( "Images/FloatyBlockDown" ),
	new Sprite( "Images/FloatyBlockLeft" ),
	new Sprite( "Images/FloatyBlockRight" )
]
FloatyBlock.partSpawnChance = 0.15
FloatyBlock.checkDirs =
[
	{ x: 0,y: -1 },
	{ x: 0,y: 1 },
	{ x: -1,y: 0 },
	{ x: 1,y: 0 }
]
FloatyBlock.floatSpd = 0.5