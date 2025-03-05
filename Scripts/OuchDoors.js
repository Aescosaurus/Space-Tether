class OuchDoors
{
	constructor( gfx )
	{
		this.closing = false
		this.opening = false
		
		this.closed = false
		
		this.doorSprs =
		[
			new Sprite( "Images/DoorLeft" ),
			new Sprite( "Images/DoorRight" )
		]
		
		const self = this
		
		// temporary values to prevent left door from drawing on screen before loaded
		//  I guess we should have done this from the start but we will have to change this if
		//   we change the size of the sprites
		this.leftStart = -100
		this.rightStart = gfx.scrWidth
		this.leftEnd = 0
		this.rightEnd = gfx.scrWidth - 100
		self.leftX = this.leftStart
		self.rightX = this.rightStart
		
		this.doorSprs[1].img.onload = function()
		{
			self.leftStart = -self.doorSprs[0].img.width
			self.rightStart = gfx.scrWidth
			
			self.leftEnd = 0
			self.rightEnd = gfx.scrWidth - self.doorSprs[1].img.width
			
			self.leftX = self.leftStart
			self.rightX = self.rightStart
		}
		
		this.closeSpeed = 0.03
		this.openSpeed = 0.08
		this.progress = 0.0
	}
	
	Update()
	{
		if( this.closing )
		{
			this.progress += this.closeSpeed
			if( this.progress > 1.0 )
			{
				this.progress = 1.0
				this.closed = true
			}
			
			const bounceEq = this.EaseOutBounce( this.progress )
			this.leftX = this.Interp( this.leftStart,this.leftEnd,bounceEq )
			this.rightX = this.Interp( this.rightStart,this.rightEnd,bounceEq )
		}
		else if( this.opening )
		{
			this.progress += this.openSpeed
			if( this.progress > 1.0 )
			{
				this.progress = 1.0
				this.opening = false
			}
			
			this.leftX = this.Interp( this.leftEnd,this.leftStart,this.progress )
			this.rightX = this.Interp( this.rightEnd,this.rightStart,this.progress )
		}
	}
	
	Draw( gfx )
	{
		if( this.opening || this.closing )
		{
			gfx.DrawSprite( this.leftX,0,this.doorSprs[0] )
			gfx.DrawSprite( this.rightX,0,this.doorSprs[1] )
		}
	}
	
	Close()
	{
		this.closing = true
		this.opening = false
		this.closed = false
		this.progress = 0.0
		OuchDoors.closeSound.Play()
	}
	
	Open()
	{
		this.closing = false
		this.opening = true
		this.closed = false
		this.progress = 0.0
	}
	
	BounceEquation( progress )
	{
		return( 1.0 - this.EaseOutBounce( 1.0 - progress ) )
	}
	
	// Found this here: https://easings.net/
	EaseOutBounce( x )
	{
		const n1 = 7.5625
		const d1 = 2.75
		
		if( x < 1.0 / d1 ) return( n1 * x * x )
		else if( x < 2.0 / d1 ) return( n1 * ( x -= 1.5 / d1 ) * x + 0.75 )
		else if( x < 2.5 / d1 ) return( n1 * ( x -= 2.25 / d1 ) * x + 0.9375 )
		else return( n1 * ( x -= 2.625 / d1 ) * x + 0.984375 )
	}
	
	Interp( start,end,percent )
	{
		return( start + ( end - start ) * percent )
	}
}

OuchDoors.closeSound = new Sound( "Audio/DoorClose" )