class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.kbd = new Keyboard()
		this.mouse = new Mouse( this.gfx )
		
		this.menu = new Menu()
		// this.levelEditor = new LevelEditor()
		
		this.particleHand = new ParticleHandler()
		this.ouchDoors = new OuchDoors( this.gfx )
		this.tutHandler = new TutHandler()
		
		this.tilemap = new Tilemap( this.gfx,this.tutHandler )
		this.exit = new LevelExit( this.tilemap,this.particleHand )
		this.player = new Player( this.gfx,this.ouchDoors,this.exit,this.tilemap,this.particleHand,this.menu )
		this.tether = new Tether( this.player,this.tilemap,this.particleHand )
		
		this.spikes = []
		this.switches = []
		this.lasers = []
		this.moveRocks = []
		this.levers = []
		this.critters = []
		this.floatyBlocks = []
		
		this.Reset()
	}
	
	Update()
	{
		if( this.menu.open )
		{
			this.menu.Update( this.mouse,this.kbd )
			
			if( this.menu.StartPressed() && !this.ouchDoors.closing ) this.ouchDoors.Close()
			
			if( this.ouchDoors.closed )
			{
				this.menu.open = false	
				this.ouchDoors.Open()
			}
			
			// if( this.menu.LevelEditPressed() )
			// {
			// 	this.menu.open = false
			// 	this.levelEditor.open = true
			// }
		}
		// else if( this.levelEditor.open )
		// {
		// 	this.levelEditor.Update( this.mouse,this.kbd )
		// }
		else
		{
			if( this.player.Update( this.kbd,this.tilemap,this.spikes ) )
			{
				this.Reset()
			}
			
			this.tether.Update( this.kbd,this.tilemap )
			
			this.exit.Update()
			
			this.tutHandler.Update()
			
			this.particleHand.Update()
			
			for( let i in this.spikes )
			{
				const spike = this.spikes[i]
				spike.Update()
				spike.TryFall( this.player )
				
				for( let j in this.critters )
				{
					const c = this.critters[j]
					// spike.TryFall( c )
					if( c.Overlaps( spike,spike.size ) )
					{
						this.particleHand.CreateParticle( c,2,Random.Range( 50,60 ) )
						this.particleHand.CreateParticle( spike,2,Random.Range( 30,40 ) )
						this.critters.splice( j,1 )
						this.spikes.splice( i,1 )
					}
				}
				
				if( this.player.Overlaps( spike,spike.size * 0.8 ) ) this.player.Ouch()
			}
			
			for( let s of this.switches )
			{
				s.Update( this.player,this.lasers )
				for( let m of this.moveRocks ) s.Update( m,this.lasers )
			}
				
			for( let l of this.lasers ) l.Update( this.player )
			
			for( let i in this.moveRocks )
			{
				const m = this.moveRocks[i]
				m.Update( this.player,this.tether,this.lasers,this.floatyBlocks )
				if( m.destroy )
				{
					this.moveRocks.splice( i,1 )
					this.particleHand.CreateParticle( { x: m.x + 4,y: m.y + 4 },2,Random.Range( 50,60 ) )
				}
			}
			
			for( let l of this.levers )
			{
				l.Update( this.player,this.lasers )
				
				for( let c of this.critters ) l.Update( c,this.lasers )
			}
			
			for( let i in this.critters )
			{
				const c = this.critters[i]
				c.Update( this.player,this.spikes )
				if( c.ouch )
				{
					this.critters.splice( i,1 )
					this.particleHand.CreateParticle( { x: c.x + 4,y: c.y + 4 },2,Random.Range( 50,60 ) )
				}
			}
			
			for( let f of this.floatyBlocks )
			{
				f.Update( this.player,this.tether )
			}
		}
		
		this.ouchDoors.Update()
	}
	
	Draw()
	{
		if( this.menu.open )
		{
			this.menu.Draw( this.gfx )
		}
		// else if( this.levelEditor.open )
		// {
		// 	this.levelEditor.Draw( this.gfx )
		// }
		else
		{
			this.tilemap.Draw( this.gfx )
			
			for( let f of this.floatyBlocks ) f.Draw( this.gfx )
			
			for( let s of this.switches ) s.Draw( this.gfx )
			
			for( let l of this.lasers ) l.Draw( this.gfx )
			
			for( let m of this.moveRocks ) m.Draw( this.gfx )
			
			for( let l of this.levers ) l.Draw( this.gfx )
			
			for( let c of this.critters ) c.Draw( this.gfx )
			
			for( let spike of this.spikes ) spike.Draw( this.gfx )
			
			this.player.Draw( this.gfx )
			
			this.tether.Draw( this.gfx )
			
			// this.exit.Draw( this.gfx )
			
			this.particleHand.Draw( this.gfx )
			
			this.tutHandler.Draw( this.gfx )
		}
		
		this.ouchDoors.Draw( this.gfx )
	}
	
	Reset()
	{
		this.tether.Reset()
		this.exit.Reset()
		this.particleHand.Reset()
		Lever.Reset()
		
		this.spikes.length = 0
		for( let pos of this.tilemap.spikeLocs )
		{
			this.spikes.push( new Spike( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.switches.length = 0
		for( let pos of this.tilemap.switchLocs )
		{
			this.switches.push( new Switch( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.lasers.length = 0
		for( let pos of this.tilemap.laserLocs )
		{
			this.lasers.push( new Laser( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.moveRocks.length = 0
		for( let pos of this.tilemap.moveRockLocs )
		{
			this.moveRocks.push( new MovableRock( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.levers.length = 0
		for( let pos of this.tilemap.leverLocs )
		{
			this.levers.push( new Lever( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.critters.length = 0
		for( let pos of this.tilemap.critterLocs )
		{
			this.critters.push( new Critter( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
		
		this.floatyBlocks.length = 0
		for( let pos of this.tilemap.floatyLocs )
		{
			this.floatyBlocks.push( new FloatyBlock( pos.x,pos.y,this.tilemap,this.particleHand ) )
		}
	}
}

const main = new Main()

setInterval( function()
{
	// main.gfx.DrawRect( 0,0,main.gfx.scrWidth,main.gfx.scrHeight,"#000000" )
	main.Update()
	main.Draw()
},1000 / 60.0 )