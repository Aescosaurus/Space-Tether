class SliderBar
{
	constructor( x,y,width,height,defaultVal,textSpr )
	{
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		
		if( defaultVal < 0.0 ) defaultVal = 0.0
		else if( defaultVal > 1.0 ) defaultVal = 1.0
		this.buttonX = this.x + ( this.width * defaultVal )
		this.buttonSize = { x: 4,y: height + 2 }
		
		this.textSpr = textSpr
		
		this.dragging = false
	}
	
	Update( mouse )
	{
		if( mouse.down && this.Contains( mouse.x,mouse.y,this.x,this.y - this.height / 2 ) )
		{
			this.dragging = true
		}
		
		if( this.dragging )
		{
			this.buttonX = mouse.x
			if( this.buttonX < this.x ) this.buttonX = this.x
			else if( this.buttonX > this.x + this.width ) this.buttonX = this.x + this.width
			
			if( !mouse.down ) this.dragging = false
		}
		
		return( this.dragging )
	}
	
	Draw( gfx )
	{
		// text
		gfx.DrawSprite( this.x,this.y - this.textSpr.height - 4,this.textSpr )
		
		// bar
		gfx.DrawRect( this.x,this.y - this.height / 2,this.width,this.height,SliderBar.barCol )
		
		// button
		gfx.DrawRect( this.buttonX - this.buttonSize.x / 2,this.y - this.buttonSize.y / 2,
			this.buttonSize.x,this.buttonSize.y,SliderBar.buttonCol )
	}
	
	GetPercent()
	{
		const val = ( this.buttonX - this.x ) / this.width
		return( ( Math.min( val,1.0 ) ) )
	}
	
	Contains( x,y,sx,sy )
	{
		return( x <= sx + this.width && x >= sx &&
			y <= sy + this.height && y >= sy )
	}
}

SliderBar.barCol = "#cebdb0"
SliderBar.buttonCol = "#ac9098"