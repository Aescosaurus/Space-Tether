class Sound
{
	constructor( src,vol = 0.1,isMusic = false )
	{
		this.sound = new Audio( src + ".wav" )
		this.vol = vol
		if( isMusic )
		{
			this.sound.volume = vol
			Sound.musics.push( this )
		}
		this.isMusic = isMusic
	}
	
	Play()
	{
		if( Sound.globalMute ) return
		
		if( !this.isMusic ) this.sound.volume = this.vol * Sound.soundVol
		this.sound.currentTime = 0
		this.sound.play()
	}
	
	Loop()
	{
		if( Sound.globalMute ) return
		
		if( !this.isMusic ) this.sound.volume = this.vol * Sound.soundVol
		this.sound.loop = true
		this.sound.play()
	}
	
	Stop()
	{
		this.sound.pause()
		this.sound.currentTime = 0.0
	}
	
	SetVolume( vol )
	{
		this.sound.volume = vol
	}
	
	Playing()
	{
		return( !this.sound.paused )
	}
}

Sound.soundVol = 0.5
Sound.musics = []
Sound.globalMute = false

Sound.SetMusicVol = function( vol )
{
	for( const mus of Sound.musics )
	{
		mus.sound.volume = vol * mus.vol
	}
}