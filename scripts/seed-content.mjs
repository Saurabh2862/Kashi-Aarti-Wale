import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
const services = [
  ['wedding', 'Wedding Ganga Aarti', 'Aarti', 'A Ganga Aarti ceremony for your wedding celebration, planned around your venue and event schedule.'],
  ['rudrabhishek', 'Rudrabhishek', 'Pujas & Path', 'Arrange a Rudrabhishek puja. Discuss your sankalp, preferred date, samagri, and venue with Priyanshu.'],
  ['durga-path', 'Durga Path', 'Pujas & Path', 'Durga Path for your home or festive occasion. Confirm the recitation, duration, and puja arrangements before booking.'],
  ['griha-pravesh', 'Griha Pravesh', 'Home & Family', 'A housewarming puja for your new home, with rituals and materials discussed around your family traditions.'],
  ['vivah-puja', 'Vivah Puja', 'Marriage Rituals', 'Marriage rituals coordinated with your family and wedding schedule. This is separate from a Wedding Ganga Aarti.'],
  ['satyanarayan-puja', 'Satyanarayan Puja', 'Pujas & Path', 'Satyanarayan puja and katha for families. Speak with us about your occasion, guests, and arrangements.'],
  ['ganesh-puja', 'Ganesh Puja', 'Pujas & Path', 'Ganesh puja for a new beginning or special occasion. The ceremony scope and samagri are agreed in advance.'],
  ['namkaran', 'Namkaran / Mundan', 'Home & Family', 'Family ceremonies for your child, planned with attention to timing, comfort, and your family customs.'],
  ['anniversary', 'Anniversary Aarti', 'Aarti', 'Mark a shared milestone with an aarti for the couple and family at your chosen venue.'],
  ['durga-puja', 'Durga Puja', 'Pujas & Path', 'Durga Puja arrangements for homes and festive gatherings. Ask about the format suitable for your celebration.'],
  ['community-aarti', 'Community & Corporate Aarti', 'Aarti', 'A coordinated aarti for cultural programmes, community gatherings, and institutional events.'],
  ['other-puja', 'Other Puja', 'Pujas & Path', 'Have another puja in mind? Share the ritual or family occasion so we can confirm availability and requirements.'],
];
const queries = services.map(([slug, name, category, description], position) => sql`insert into services(slug,name,category,description,position,active) values(${slug},${name},${category},${description},${position},true) on conflict(slug) do nothing`);
const videos = [
  ['01', 'Sacred flames', 'The multi-tier deep aarti in a ceremony setting.'],
  ['03', 'Mantra and devotion', 'A moment of prayer from our ceremony recordings.'],
  ['06', 'At your celebration', 'A glimpse of an aarti arranged for a gathering.'],
  ['07', 'A shared blessing', 'Shared moments from an aarti ceremony.'],
  ['05', 'Light of Kashi', 'A closer look at the lamps and ritual details.'],
];
// Run once at setup. Re-running restores deleted legacy video entries; never run during every deploy.
for (const [position, [number, title, description]] of videos.entries()) queries.push(sql`insert into gallery_videos(id,title,description,ceremony,location,legacy_src,active,position) values(${`legacy-${number}`},${title},${description},'Ganga Aarti','',${`/media/aarti-ceremony-${number}.mp4`},true,${position}) on conflict(id) do nothing`);
await sql.transaction(queries);
console.log('Initial services and existing gallery videos seeded; existing edits preserved.');
