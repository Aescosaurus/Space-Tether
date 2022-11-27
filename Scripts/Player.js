class Player
{
	constructor( gfx,ouchDoors,exit,tilemap,particleHand,menu )
	{
		this.xStart = tilemap.playerLoc.x * tilemap.tileSize + tilemap.tileSize / 2
		this.yStart = tilemap.playerLoc.y * tilemap.tileSize + tilemap.tileSize / 2
		this.x = this.xStart
		this.y = this.yStart
		this.size = 6
		
		this.accel = 0.35
		this.xVel = 0.0
		this.decay = 0.75
		this.step = 0.05
		this.dir = 1
		
		this.jumping = false
		this.gravAcc = 0.2
		this.yVel = 0.0
		this.jumpPower = 2.0
		this.jumpTimer = 0
		this.jumpDuration = 2
		this.canJump = false
		this.jumpStopTimer = 0.0
		this.jumpStopDuration = 7
		
		this.lastR = false
		
		const hSize = this.size / 2
		this.collCheckOffsets = [
			[ 0,0 ],
			[ -hSize,-hSize ],
			[ 0,-hSize ],
			[ hSize,-hSize ],
			[ hSize,0 ],
			[ hSize,hSize ],
			[ 0,hSize ],
			[ -hSize,hSize ],
			[ -hSize,0 ]
		]
		
		this.frozen = false
		this.drawCol = "cyan"
		this.ouch = false
		
		this.anim = new Anim( "Images/Player",2,8 )
		this.leftAnim = new Anim( "Images/PlayerLeft",2,8 )
		
		this.ouchDoors = ouchDoors
		this.exit = exit
		this.exitRange = 10
		
		this.tilemap = tilemap
		this.particleHand = particleHand
		
		this.menu = menu
		
		this.tetherOverride = false
		
		this.jumpRefire = 8
		this.jumpCounter = this.jumpRefire
	}
	
	Update( kbd,tilemap )
	{
		if( kbd.KeyDown( 'A' ) )
		{
			if( !this.frozen ) this.xVel -= this.accel
			this.dir = -1
		}
		if( kbd.KeyDown( 'D' ) )
		{
			if( !this.frozen ) this.xVel += this.accel
			this.dir = 1
		}
		
		if( kbd.KeyDown( 'R' ) && !this.lastR )
		{
			this.lastR = true
			this.Ouch()
		}
		else this.lastR = false;
		
		if( this.y - 4 > 72 ) this.Ouch()
		
		if( this.ouch )
		{
			this.xVel = 0.0
			this.yVel = 0.0
			
			if( this.ouchDoors.closed )
			{
				tilemap.LoadLevel()
				this.Reset()
				
				return( true )
			}
			
			return
		}
		else
		{
			const xDiff = this.exit.x - this.x
			const yDiff = this.exit.y - this.y
			if( xDiff * xDiff + yDiff * yDiff < this.exitRange * this.exitRange )
			{
				if( tilemap.curLevel >= levels.length - 1 ) this.menu.WinGame()
				else
				{
					this.Ouch()
					++tilemap.curLevel
					LevelExit.winSound.Play()
				}
			}
		}
		
		if( Math.abs( this.xVel ) > 0.02 || Math.abs( this.yVel ) > 0.02 )
		{
			this.anim.Update()
			this.leftAnim.Update()
		}
		
		if( this.CheckTileCollision( tilemap,0.0,0.1 ) )
		{
			this.canJump = true
			this.jumpStopTimer = 0
		}
		else
		{
			if( ++this.jumpStopTimer > this.jumpStopDuration )
			{
				this.jumpStopTimer = 0
				this.canJump = false
			}
		}
		
		if( kbd.KeyDown( 'W' ) && !this.frozen )
		{
			if( this.canJump )
			{
				this.jumping = true
				if( ++this.jumpCounter >= this.jumpRefire )
				{
					this.jumpCounter = 0
					Player.jumpSound.Play()
				}
			}
		}
		else this.jumping = false
		
		if( !this.CheckTileCollision( tilemap,this.xVel,0.0 ) )
		{
			this.x += this.xVel
		}
		else
		{
			let dist = 0.0
			while( !this.CheckTileCollision( tilemap,this.step,0.0 ) &&
				dist < this.xVel )
			{
				this.x += this.step * this.CalcDir( this.xVel )
				dist += this.step
			}
			
			this.xVel = 0.0
		}
		
		this.xVel *= this.decay
		
		if( Math.abs( this.xVel ) < 0.2 ) this.xVel = 0.0
		
		// 
		
		if( this.jumping )
		{
			this.yVel = -this.jumpPower
			
			if( ++this.jumpTimer > this.jumpDuration )
			{
				this.jumpTimer = 0
				this.jumping = false
			}
		}
		this.yVel += this.gravAcc
		
		if( !this.CheckTileCollision( tilemap,0.0,this.yVel ) )
		{
			this.y += this.yVel
		}
		else
		{
			let dist = 0.0
			while( !this.CheckTileCollision( tilemap,0.0,this.step ) &&
				dist < this.yVel )
			{
				this.y += this.step * this.CalcDir( this.yVel )
				dist += this.step
			}
			
			this.yVel = 0.0
		}
		
		// console.log( this.tilemap.GetTileWorld( this.x + 4,this.y + 4 ) )
		if( this.CheckTileCollision( tilemap,0.0,0.0 ) ) this.Ouch()
	}
	
	Draw( gfx )
	{
		// gfx.DrawRect( Math.round( this.x - this.size / 2 ),
		// 	Math.round( this.y - this.size / 2 ),
		// 	this.size,this.size,this.drawCol )
		
		if( this.dir > 0 )
		{
			this.anim.Draw( Math.round( this.x - this.size / 2 ),
				Math.round( this.y - this.size / 2 ),
				gfx )
		}
		else
		{
			this.leftAnim.Draw( Math.round( this.x - this.size / 2 ),
				Math.round( this.y - this.size / 2 ),
				gfx )
		}
	}
	
	// Returns true for collision.
	CheckTileCollision( tilemap,xVel,yVel )
	{
		for( let i = 0; i < this.collCheckOffsets.length; ++i )
		{
			if( tilemap.GetTileWorld(
				this.x + xVel + this.collCheckOffsets[i][0],
				this.y + yVel + this.collCheckOffsets[i][1] ) > 0 )
			{
				return( true )
			}
		}
		
		return( false )
	}
	
	CalcDir( val )
	{
		if( Math.abs( val ) > 0 ) return( val / Math.abs( val ) )
		else return( 0.0 )
	}
	
	Ouch()
	{
		if( !this.ouch )
		{
			this.particleHand.CreateParticle( this,2,45 )
			this.drawCol = "red"
			this.ouch = true
			this.ouchDoors.Close()
		}
	}
	
	Reset()
	{
		this.xStart = this.tilemap.playerLoc.x * this.tilemap.tileSize + this.tilemap.tileSize / 2
		this.yStart = this.tilemap.playerLoc.y * this.tilemap.tileSize + this.tilemap.tileSize / 2
		this.x = this.xStart
		this.y = this.yStart
		this.xVel = 0.0
		this.yVel = 0.0
		this.frozen = false
		this.ouch = false
		this.ouchDoors.Open()
		this.dir = 1
	}
	
	Overlaps( other,otherSize )
	{
		return( this.x + this.size / 2 > other.x && this.x - this.size / 2 < other.x + otherSize &&
			this.y + this.size / 2 > other.y && this.y - this.size / 2 < other.y + otherSize )
	}
}

Player.jumpSound = new Sound( "Audio/PlayerJump" )