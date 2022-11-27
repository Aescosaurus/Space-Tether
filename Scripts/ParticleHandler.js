class ParticleHandler
{
	constructor()
	{
		this.particles = []
		
		this.particleSprs =
		[
			new Sprite( "Images/Particle1" ),
			new Sprite( "Images/Particle2" ),
			new Sprite( "Images/Particle3" ),
			new Sprite( "Images/Particle4" )
		]
	}
	
	Update()
	{
		for( let i = 0; i < this.particles.length; ++i )
		{
			this.particles[i].Update()
			
			if( this.particles[i].lifetime < 0 ) this.particles.splice( i,1 )
		}
	}
	
	Draw( gfx )
	{
		for( let i = 0; i < this.particles.length; ++i )
		{
			this.particles[i].Draw( gfx )
		}
	}
	
	CreateParticle( target,type,count,extraInfo = {} )
	{
		for( let i = 0; i < count; ++i )
		{
			this.particles.push( new Particle( target,
				this.particleSprs[Math.floor( Math.random() * this.particleSprs.length )],
				type,
				extraInfo ) )
		}
	}
	
	Reset()
	{
		this.particles = []
	}
}