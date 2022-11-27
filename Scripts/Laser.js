class Laser
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		this.centerX = this.x + 4
		this.centerY = this.y + 4
		
		this.partHand = partHand
		
		this.attackTolerance = tilemap.tileSize * 0.8 // from 1.8
		this.firing = false
		this.windUpTimer = 0
		this.windUp = 60
		this.winding = false
		this.windDownTimer = 0
		this.windDown = 30
		
		this.ouchTolerance = 3
		
		this.drawDirs = []
		
		this.UpdateDirs()
	}
	
	Update( player )
	{
		const xDiff = player.x - this.centerX
		const yDiff = player.y - this.centerY
		if( this.IsOverlapping( xDiff,yDiff,this.attackTolerance ) )
		{
			if( !this.winding ) Laser.chargeSound.Play()
			
			this.winding = true
		}
		
		if( this.winding )
		{
			if( ++this.windUpTimer > this.windUp )
			{
				this.windUpTimer = 0
				this.firing = true
				
				this.winding = false
				this.windDownTimer = 0
				
				Laser.shootSound.Play()
			}
		}
		else
		{
			if( ++this.windDownTimer > this.windDown )
			{
				this.windDownTimer = 0
				this.winding = false
				
				this.windUpTimer = 0
				this.firing = false
			}
		}
		
		if( this.firing )
		{
			if( this.IsOverlapping( xDiff,yDiff,this.ouchTolerance ) )
			{
				player.Ouch()
			}
		}
	}
	
	Draw( gfx )
	{
		if( !this.firing )
		{
			if( this.windUpTimer > 0 )
			{
				// use wind up timer as lerp counter to walk particles to destination
				// this.partHand.CreateParticle( { x: this.x,0,1 )
				for( let i in this.drawDirs )
				{
					const dist = this.drawDirs[i]
					if( dist > 0 )
					{
						const partPos = { x: this.x + 4,y: this.y + 4 }
						const fillPercent = this.windUpTimer / this.windUp
						partPos.x += Laser.checkDirs[i].x * dist * fillPercent * this.tilemap.tileSize
						partPos.y += Laser.checkDirs[i].y * dist * fillPercent * this.tilemap.tileSize
						this.partHand.CreateParticle( partPos,4,1 )
					}
				}
			}
		}
		else
		{
			for( let i in this.drawDirs )
			{
				const dist = this.drawDirs[i]
				if( dist > 0 )
				{
					const endLoc = { x: this.x,y: this.y }
					const cd = Laser.checkDirs[i]
					endLoc.x += cd.x * dist * this.tilemap.tileSize
					endLoc.y += cd.y * dist * this.tilemap.tileSize
					gfx.DrawRectDim( this.x + 2,this.y + 2,
						endLoc.x + Math.abs( cd.y ) * 6,endLoc.y + Math.abs( cd.x ) * 6,Laser.laserCol )
					// gfx.DrawRect( endLoc.x,endLoc.y,1,1,"red" )
					// gfx.DrawRect( endLoc.x + cd.y * 4,endLoc.y + cd.x * 4,1,1,"green" )
					
					const partPos = {
						x: Random.Range( this.x - Math.abs( cd.x ) * 4,endLoc.x - Math.abs( cd.x ) * 6 ) + 4,
						y: Random.Range( this.y - Math.abs( cd.y ) * 4,endLoc.y - Math.abs( cd.y ) * 6 ) + 4 }
					this.partHand.CreateParticle( partPos,4,1 )
				}
			}
		}
		
		gfx.DrawSprite( this.x,this.y,Laser.spr )
		for( let i in this.drawDirs )
		{
			if( this.drawDirs[i] > 0 ) gfx.DrawSprite( this.x,this.y,Laser.dirSprs[i] )
		}
	}
	
	UpdateDirs()
	{
		// this.drawDirs =
		// [
		// 	( this.tilemap.GetTileWorld( this.x,this.y - 1 ) == 0 ),
		// 	( this.tilemap.GetTileWorld( this.x,this.y + 1 ) == 0 ),
		// 	( this.tilemap.GetTileWorld( this.x - 1,this.y ) == 0 ),
		// 	( this.tilemap.GetTileWorld( this.x + 1,this.y ) == 0 )
		// ]
		
		this.drawDirs = [ 0,0,0,0 ]
		
		for( let i in Laser.checkDirs )
		{
			const curPos = { x: this.centerX,y: this.centerY }
			while( this.tilemap.GetTileWorld( curPos.x,curPos.y ) == 0 )
			{
				curPos.x += Laser.checkDirs[i].x * this.tilemap.tileSize
				curPos.y += Laser.checkDirs[i].y * this.tilemap.tileSize
				++this.drawDirs[i]
			}
		}
		
		// --this.drawDirs[0]
		// --this.drawDirs[2]
		for( let i in this.drawDirs ) --this.drawDirs[i]
		
		if( this.drawDirs[1] > 0 ) ++this.drawDirs[1]
		if( this.drawDirs[3] > 0 ) ++this.drawDirs[3]
	}
	
	IsOverlapping( xDiff,yDiff,tolerance )
	{
		const absX = Math.abs( xDiff )
		const absY = Math.abs( yDiff )
		
		const up = absY < this.drawDirs[0] * this.tilemap.tileSize && yDiff < 0.0
		const down = absY < this.drawDirs[1] * this.tilemap.tileSize && yDiff > 0.0
		const left = absX < this.drawDirs[2] * this.tilemap.tileSize && xDiff < 0.0
		const right = absX < this.drawDirs[3] * this.tilemap.tileSize && xDiff > 0.0
		
		return( ( absX < tolerance && ( up || down ) ) ||
			( absY < tolerance && ( left || right ) ) ||
			( absX < 4 && absY < 4 ) )
		// return( absX < tolerance &&
		// 	( yDiff < this.drawDirs[0] * this.tilemap.tileSize || yDiff < this.drawDirs[1] * this.tilemap.tileSize ) &&
		// 	( this.drawDirs[1] > 4 || this.drawDirs[3] > 4 ) ) ||
		// 	( absY < tolerance &&
		// 	( xDiff < this.drawDirs[2] * this.tilemap.tileSize || xDiff < this.drawDirs[3] * this.tilemap.tileSize ) &&
		// 	( this.drawDirs[0] > 4 || this.drawDirs[2] > 4 ) ) )
	}
}

Laser.spr = new Sprite( "Images/LaserBase" )
Laser.dirSprs =
[
	new Sprite( "Images/LaserUp" ),
	new Sprite( "Images/LaserDown" ),
	new Sprite( "Images/LaserLeft" ),
	new Sprite( "Images/LaserRight" )
]
Laser.checkDirs =
[
	{ x: 0,y: -1 },
	{ x: 0,y: 1 },
	{ x: -1,y: 0 },
	{ x: 1,y: 0 }
]
Laser.laserCol = "#ece6df"

Laser.shootSound = new Sound( "Audio/LaserShoot" )
Laser.chargeSound = new Sound( "Audio/LaserCharge" )