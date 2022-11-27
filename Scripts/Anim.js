class Anim
{
	constructor( name,frameCount,delay )
	{
		this.frames = []
		for( let i = 0; i < frameCount; ++i )
		{
			this.frames.push( new Sprite( name + i ) )
		}
		this.delay = delay
		this.time = 0
		this.curFrame = 0
	}
	
	Update()
	{
		if( ++this.time > this.delay )
		{
			this.time = 0
			if( ++this.curFrame >= this.frames.length )
			{
				this.curFrame = 0
			}
		}
	}
	
	Draw( x,y,gfx )
	{
		gfx.DrawSprite( x,y,this.frames[this.curFrame] )
	}
}