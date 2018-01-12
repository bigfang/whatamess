var casper = require('casper').create({
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
	}
}),
	fs = require('fs');


var timeout = casper.cli.get(0);

var urls = ["http://tv-guide.upc.at/TV/", "http://tv-guide.upc.ie/TV/", "http://www.canaldigital.dk/Guide/", "http://www.canaldigital.fi/tv-opas/", "http://www.canaldigital.se/tv-guide/", "https://parabol.canaldigital.no/aktuelt/TV-guide/", "https://kabel.canaldigital.no/TV-Guide/", "https://www.kabelbw.de/kabelbw/cms/tv/tv-programm/", "http://www.kabeldeutschland.de/programm-manager/html/epg/index.html#", "https://webtv.stofa.dk/#//page/tvguide/", "http://yousee.tv/tvguide", "http://www.plus.es/guia/programacion", "http://www.telecinco.es/programas/guia-tv/20140212.html", "http://tvopas.dna.fi/", "http://www.sonera.fi/tutustu+ja+osta/tv+ja+viihde/tv-opas/", "http://www.services.bouyguestelecom.fr/television/guide-des-programmes-iframe", "http://www.mycanal.fr/guide/ce-soir/tous/?page=1&avis=0$g$a$.0$p$a$&tri=Titre/Chaine", "http://robssatellitetv.com/frenchtvguide.htm", "http://www.numericable.tv/guide-tv", "http://programme-tv.orange.fr/grille/chaines-tv/en-ce-moment.html?thematiques=15644", "http://www.freeview.co.uk/whats-on/tv-guide", "http://www.rte.ie/ten/listings/", "http://tv.zam.it/programmitv_giorno.php?canale=10&data=2014-03-31", "https://www.ziggo.nl/#entertainment/tv-gids/", "http://www.get.no/underholdning/tv-guide", "http://www.cyfrowypolsat.pl/program-tv/#.UwMNXXyD2wF", "http://program.vectra.pl/index.php?page=0", "http://ncplus.pl/program-tv", "http://www.cabovisao.pt/tv/guia-tv/", "http://meogo.meo.pt/tv/guiatv/Pages/default.aspx?date=04/04/2014", "http://www.zon.pt/tv/guiaTV/Pages/GuiaTV.aspx#", "http://tvguide.boxer.se/Gridview.aspx?d=1"];


casper.start().each(urls, function(self, url) {
	console.log(url);
	self.thenOpen(url, function() {
		this.wait(timeout, function() {
			fs.write("./snapshots/" + url.split('/')[2] + ".html", this.getHTML(), 'w', function(err) {
				if (err)
					console.error(err.message);
			});
		});
	});
});



casper.run(function() {
	this.echo('Done.').exit();
});