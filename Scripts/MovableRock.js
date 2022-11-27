class MovableRock
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		
		this.partHand = partHand
		
		this.activateDist = 8
		this.yTolerance = 4
		this.tetherTolerance = 4.5
		
		this.gravTimer = 0
		this.grav = 5
		
		this.destroy = false
	}
	
	Update( player,tether,lasers,floatyBlocks )
	{
		const xDiff = player.x - ( this.x + 4 )
		const yDiff = player.y  - ( this.y + 4 )
		if( Math.abs( xDiff ) < this.activateDist && Math.abs( yDiff ) < this.yTolerance )
		{
			const xMove = this.tilemap.tileSize * ( -Math.sign( xDiff ) )
			
			this.TryMove( xMove,0,tether,lasers,floatyBlocks )
			
			MovableRock.moveSound.Play()
		}
		
		if( ++this.gravTimer > this.grav )
		{
			this.gravTimer = 0
			// if( this.tilemap.GetTileWorld( this.x,this.y + 8 ) <= 0 )
			{
				this.TryMove( 0,8,tether,lasers,floatyBlocks )
			}
		}
		
		const mapTile = this.tilemap.GetTileWorld( this.x,this.y )
		if( mapTile > 0 && mapTile != 4 )
		{
			this.destroy = true
			// this.tilemap.SetTileWorld( this.x,this.y,0 )
		}
		if( this.y > Graphics.screenHeight ) this.destroy = true
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,MovableRock.spr )
	}
	
	TryMove( xMove,yMove,tether,lasers,floatyBlocks )
	{
		if( this.tilemap.GetTileWorld( this.x + xMove,this.y + yMove ) > 0 ) return
		
		this.tilemap.SetTileWorld( this.x,this.y,0 )
		
		const tetherXDiff = tether.x - ( this.x + 4 )
		const tetherYDiff = tether.y - ( this.y + 4 )
		
		this.x += xMove
		this.y += yMove
		
		if( Math.abs( tetherXDiff ) < this.tetherTolerance &&
			Math.abs( tetherYDiff ) < this.tetherTolerance )
		{
			tether.x += xMove
			tether.y += yMove
		}
		
		this.tilemap.SetTileWorld( this.x,this.y,4 )
		
		for( const laser of lasers ) laser.UpdateDirs()
		for( const floaty of floatyBlocks ) floaty.UpdateDirs()
	}
}

MovableRock.spr = new Sprite( "Images/MovableRock" )
MovableRock.moveSound = new Sound( "Audio/MovingBlock" )