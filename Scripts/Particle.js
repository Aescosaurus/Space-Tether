class Particle
{
	constructor( target,spr,particleType,extraInfo )
	{
		this.x = target.x
		this.y = target.y
		this.xVel = 0.0
		this.yVel = 0.0
		
		this.target = target
		this.spr = spr
		
		this.lifetime = Math.random() * 25
		
		if( particleType == 0 )
		{
			const devRange = 12
			this.x = target.x + ( Math.random() - 0.5 ) * devRange
			this.y = target.y + ( Math.random() - 0.5 ) * devRange
			
			const spd = Math.random() * 0.6
			this.xVel = ( target.x - this.x )
			this.yVel = ( target.y - this.y )
			const len = Math.sqrt( this.xVel * this.xVel + this.yVel * this.yVel )
			this.xVel = this.xVel / len * spd
			this.yVel = this.yVel / len * spd
		}
		else if( particleType == 1 )
		{
			const spd = 0.8
			this.xVel = Math.random() * spd
			this.yVel = Math.random() * spd
			
			this.lifetime = Math.random() * 20
		}
		else if( particleType == 2 )
		{
			const spd = 1.5
			this.xVel = ( Math.random() - 0.5 ) * spd / 2.0
			this.yVel = ( Math.random() - 0.8 ) * spd
		}
		else if( particleType == 3 )
		{
			this.yVel = Random.Range( 0.3,0.5 )
			
			this.lifetime = Random.Range( 15,25 )
		}
		else if( particleType == 4 )
		{
			const spd = 0.5
			this.xVel = ( Math.random() - 0.5 ) * spd
			this.yVel = ( Math.random() - 0.5 ) * spd
		}
		else if( particleType == 5 )
		{
			const spdMin = 0.2
			const spdMax = 0.8
			this.xVel = extraInfo.xVel * Random.Range( spdMin,spdMax )
			this.yVel = extraInfo.yVel * Random.Range( spdMin,spdMax )
			
			// this.lifetime = Random.Range( 30,50 )
			this.lifetime = extraInfo.lifetime
		}
	}
	
	Update()
	{
		this.x += this.xVel
		this.y += this.yVel
		
		--this.lifetime
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,this.spr )
	}
}