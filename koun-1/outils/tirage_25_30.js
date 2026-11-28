// Matchs du 25 au 30 novembre 2026 (calendriers trouvés sur le web le 2026-11-23) et tirage d'un thème valide (FI-5 avec la figure du jour) pour chacun.
const fs = require('fs'), crypto = require('crypto'), S = __dirname + '/../validation/';
const M = require('../moteur4/moteur.js');
const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const C = {
  'Europa League': { '2026-11-26': ['Beşiktaş|Hapoel Beer-Sheva', 'Celta Vigo|Bournemouth', 'Dinamo Zagreb|Leverkusen', 'Marseille|Levski Sofia', 'Olympiacos|AC Milan', 'Viktoria Plzeň|Benfica', 'Salzbourg|Ararat-Armenia', 'Union Saint-Gilloise|Lech Poznań', 'Hoffenheim|Sturm Graz', 'Crystal Palace|Real Sociedad', 'Ferencváros|Celje', 'Juventus|Omonia', 'Lyon|Lillestrøm', 'NEC Nimègue|Rennes', 'OFI Crète|Anderlecht', 'Sparta Prague|AZ Alkmaar', 'Sunderland|Jagiellonia', 'Torreense|Celtic'] },
  'Premier League': { '2026-11-27': ['Nottingham Forest|Chelsea'], '2026-11-28': ['Leeds|Coventry', 'Manchester United|Brentford', 'Ipswich|Aston Villa'], '2026-11-29': ['Everton|Liverpool', 'Brighton|Newcastle', 'Crystal Palace|Hull City', 'Fulham|Bournemouth', 'Sunderland|Tottenham', 'Arsenal|Manchester City'] },
  'Championship': { '2026-11-27': ['Southampton|Middlesbrough'], '2026-11-28': ['Lincoln City|Wolverhampton', 'Preston|Norwich', 'Blackburn|Charlton', 'Derby County|Watford', 'Millwall|Burnley', 'West Ham|Stoke City', 'Wrexham|Portsmouth', 'West Bromwich|Bristol City', 'QPR|Sheffield United', 'Birmingham|Bolton', 'Swansea|Cardiff'] },
  'Ligue 1': { '2026-11-27': ['Brest|Paris FC'], '2026-11-28': ['Angers|Lens', 'PSG|Lorient', 'Le Mans|Lille', 'Le Havre|Strasbourg', 'Nice|Troyes'], '2026-11-29': ['Auxerre|Marseille', 'Toulouse|Rennes', 'Lyon|Monaco'] },
  'Liga': { '2026-11-27': ['Levante|Racing Santander'], '2026-11-28': ['Betis|Rayo Vallecano', 'Málaga|Athletic', 'Elche|Atlético', 'Real Madrid|Alavés'], '2026-11-29': ['Valencia|Osasuna', 'Deportivo|Barcelona', 'Celta Vigo|Villarreal'], '2026-11-30': ['Real Sociedad|Séville', 'Espanyol|Getafe'] },
  'Liga 2': { '2026-11-27': ['Leganés|Sabadell'], '2026-11-29': ['Almería|Sporting Gijón', 'Cádiz|Córdoba', 'Albacete|Tenerife', 'Ceuta|Granada', 'Eibar|Burgos', 'Mallorca|Castellón', 'Las Palmas|Andorra', 'Eldense|Girona', 'Valladolid|Real Sociedad B'], '2026-11-30': ['Oviedo|Celta Fortuna'] },
  'Serie A': { '2026-11-27': ['Venezia|Bologna'], '2026-11-28': ['Frosinone|Parma', 'Torino|Lazio', 'Inter|Genoa'], '2026-11-29': ['Udinese|Fiorentina', 'Sassuolo|Napoli', 'Roma|Monza', 'Como|Juventus'], '2026-11-30': ['Lecce|Atalanta', 'Cagliari|AC Milan'] },
  'Bundesliga': { '2026-11-27': ['Werder Brême|Mönchengladbach'], '2026-11-28': ['Mainz|Union Berlin', 'Hambourg|Bayern', 'Cologne|Elversberg', 'Paderborn|Schalke 04', 'Stuttgart|Eintracht Francfort'], '2026-11-29': ['Fribourg|RB Leipzig', 'Hoffenheim|Augsburg', 'Dortmund|Leverkusen'] },
  'Belgique': { '2026-11-27': ['OH Louvain|Courtrai'], '2026-11-28': ['Westerlo|La Louvière', 'Lommel|Zulte Waregem', 'Charleroi|Beveren', 'Cercle Bruges|Malines'], '2026-11-29': ['Saint-Trond|Genk', 'Royal Antwerp|Anderlecht', 'Standard|Club Bruges', 'Union Saint-Gilloise|La Gantoise'] },
  'Pays-Bas': { '2026-11-27': ['Groningue|Willem II'], '2026-11-28': ['Excelsior|Telstar', 'PSV|Go Ahead Eagles', 'Cambuur|Sparta Rotterdam'], '2026-11-29': ['ADO La Haye|Utrecht', 'Fortuna Sittard|Heerenveen', 'Feyenoord|Ajax', 'NEC Nimègue|Twente', 'PEC Zwolle|AZ Alkmaar'] },
  'Portugal': { '2026-11-27': ['Marítimo|Nacional'], '2026-11-28': ['Moreirense|Santa Clara', 'Arouca|Rio Ave', 'Académico Viseu|Alverca', 'Vitória Guimarães|Estrela Amadora'], '2026-11-29': ['Gil Vicente|Estoril', 'FC Porto|Sporting'], '2026-11-30': ['Benfica|Famalicão', 'Casa Pia|Braga'] },
  'Grèce': { '2026-11-28': ['Iraklis|Panetolikos', 'Volos|Asteras Tripolis', 'Kifisia|Kalamata'] },
  'MLS': { '2026-11-27': ['Columbus|Inter Miami'], '2026-11-28': ['Charlotte|Chicago', 'Houston|San Jose', 'Philadelphie|New England', 'LAFC|St. Louis', 'Portland|FC Dallas'] },
};
if (fs.existsSync(S + 'themes-25-30-novembre.json')) { console.log('thèmes déjà tirés et figés : validation/themes-25-30-novembre.json (on ne retire pas)'); process.exit(0); }
const out = [];
for (const [c, jours] of Object.entries(C)) for (const [d, ms] of Object.entries(jours)) for (const m of ms) {
  const [e1, e2] = m.split('|'), j = new Date(d + 'T12:00:00Z').getUTCDay(); let t, n = 0;
  do { t = [0, 1, 2, 3].map(() => 1 + crypto.randomInt(16)); n++; } while (!M.fiabilite(M.lire(t), j).valide);
  out.push({ date: d, championnat: c, equipe1: e1, equipe2: e2, jour: JOURS[j], theme: t.join('-'), essais: n });
}
fs.writeFileSync(S + 'themes-25-30-novembre.json', JSON.stringify(out, null, 1));
console.log(out.length, 'thèmes tirés, tous valides (FI-5 avec la figure du jour)');
