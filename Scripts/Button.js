class Button
{
	constructor( x,y,spr,hoverSpr )
	{
		this.x = x
		this.y = y
		this.spr = spr
		this.hoverSpr = hoverSpr
		
		this.hover = false
		this.canPress = false
		this.pressed = false
	}
	
	Update( mouse )
	{
		const oldHover = this.hover
		this.hover = this.spr.Contains( mouse.x,mouse.y,this.x - this.spr.width / 2,this.y - this.spr.height / 2 )
		
		if( !oldHover && this.hover ) Button.hoverSound.Play()
		
		this.pressed = false
		if( mouse.down )
		{
			if( this.canPress )
			{
				if( this.hover )
				{
					if( !this.pressed ) Button.clickSound.Play()
					this.pressed = true
				}
				this.canPress = false
			}
		}
		else this.canPress = true
		
		return( this.pressed )
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x - this.spr.width / 2,this.y - this.spr.height / 2,( this.hover ? this.hoverSpr : this.spr ) )
	}
}

Button.clickSound = new Sound( "Audio/MenuClick" )
Button.hoverSound = new Sound( "Audio/MenuHover" )