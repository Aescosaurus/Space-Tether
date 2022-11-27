class TutHandler
{
	constructor()
	{
		this.tutList = []
	}
	
	Update()
	{
		for( let i = 0; i < this.tutList.length; ++i )
		{
			this.tutList[i].anim.Update()
		}
	}
	
	Draw( gfx )
	{
		for( let i = 0; i < this.tutList.length; ++i )
		{
			this.tutList[i].anim.Draw( this.tutList[i].x,
				this.tutList[i].y,
				gfx )
		}
	}
	
	LoadTutList( tutList )
	{
		this.tutList = tutList
		if( this.tutList == undefined ) this.tutList = []
	}
}