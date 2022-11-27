class Critter
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		this.xSize = 8
		this.ySize = 0
		
		this.partHand = partHand
		
		this.anim = new Anim( "Images/Critter",2,12 )
		this.leftAnim = new Anim( "Images/CritterLeft",2,12 )
		
		this.dir = 1
		
		this.gravAcc = 0.2
		this.yVel = 0.0
		
		this.ouch = false
	}
	
	Update( player,spikes )
	{
		// const diff = player.x - this.x
		
		// if( Math.abs( diff ) > 0 ) this.dir = Math.sign( diff )
		
		// if( Math.abs( diff ) > Critter.moveTrigger )
		{
			const testMove = this.dir * Critter.moveSpd
			if( this.tilemap.GetTileWorld( this.x + testMove + this.dir * this.xSize / 2,this.y + 1 ) < 1 )
			{
				this.x += testMove
				this.anim.Update()
				this.leftAnim.Update()
			}
			else
			{
				this.dir *= -1
			}
		}
		
		if( player.Overlaps( { x: this.x - 4,y: this.y + 1 },8 ) ) player.Ouch()
		
		this.yVel += this.gravAcc
		if( this.tilemap.GetTileWorld( this.x,this.y + 8 + this.yVel ) < 1 )
		{
			this.y += this.yVel
		}
		else
		{
			this.yVel = 0.0
		}
		
		if( this.tilemap.GetTileWorld( this.x,this.y ) > 0 ) this.ouch = true
		for( let spike of spikes ) if( this.Overlaps( spike,spike.size * 0.8 ) ) this.ouch = true
		if( this.y > Graphics.screenHeight ) this.ouch = true
	}
	
	Draw( gfx )
	{
		if( this.dir > 0 )
		{
			this.anim.Draw( Math.round( this.x - this.xSize / 2 ),
				Math.round( this.y - this.ySize / 2 ),
				gfx )
		}
		else
		{
			this.leftAnim.Draw( Math.round( this.x - this.xSize / 2 ),
				Math.round( this.y - this.ySize / 2 ),
				gfx )
		}
	}
	
	Overlaps( other,otherSize )
	{
		return( this.x + this.xSize / 2 > other.x && this.x - this.xSize / 2 < other.x + otherSize &&
			this.y + this.xSize / 2 > other.y && this.y - this.xSize / 2 < other.y + otherSize )
	}
}

Critter.moveTrigger = 8
Critter.moveSpd = 0.3