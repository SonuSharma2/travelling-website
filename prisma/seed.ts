import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nepal-exclusive travel journal database...');

  // 1. Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@traveljournal.com' },
    update: { name: 'Sonu Sharma' },
    create: {
      email: 'admin@traveljournal.com',
      name: 'Sonu Sharma',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
  });

  // 2. Clean existing records
  await prisma.photo.deleteMany({});
  await prisma.journey.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.country.deleteMany({});

  // 3. Country: Nepal
  const nepal = await prisma.country.create({
    data: {
      name: 'Nepal',
      slug: 'nepal',
      code: 'NP',
    },
  });

  // 4. Destinations in Nepal
  const pokharaDest = await prisma.destination.create({
    data: {
      name: 'Pokhara',
      slug: 'pokhara',
      countryId: nepal.id,
      latitude: 28.2096,
      longitude: 83.9856,
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    },
  });

  const mustangDest = await prisma.destination.create({
    data: {
      name: 'Mustang',
      slug: 'mustang',
      countryId: nepal.id,
      latitude: 29.1834,
      longitude: 83.9782,
      coverImage: 'https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=1920&q=85',
    },
  });

  const ktmDest = await prisma.destination.create({
    data: {
      name: 'Kathmandu Valley',
      slug: 'kathmandu',
      countryId: nepal.id,
      latitude: 27.7172,
      longitude: 85.3240,
      coverImage: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1920&q=85',
    },
  });

  const namcheDest = await prisma.destination.create({
    data: {
      name: 'Namche Bazaar',
      slug: 'namche-bazaar',
      countryId: nepal.id,
      latitude: 27.8069,
      longitude: 86.7140,
      coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1920&q=85',
    },
  });

  const chitwanDest = await prisma.destination.create({
    data: {
      name: 'Chitwan',
      slug: 'chitwan',
      countryId: nepal.id,
      latitude: 27.5291,
      longitude: 84.4533,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
    },
  });

  const bandipurDest = await prisma.destination.create({
    data: {
      name: 'Bandipur',
      slug: 'bandipur',
      countryId: nepal.id,
      latitude: 27.9358,
      longitude: 84.4172,
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=85',
    },
  });

  // 5. Journeys & Curated Photographs

  // --- 1. POKHARA ---
  const pokharaJourney = await prisma.journey.create({
    data: {
      title: 'Pokhara',
      slug: 'pokhara',
      countryName: 'Nepal',
      cityName: 'Pokhara Valley',
      latitude: 28.2096,
      longitude: 83.9856,
      travelDate: new Date('2026-03-12'),
      daysCount: 4,
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Four days beside Phewa Lake, surrounded by the jagged white crown of the Annapurnas, quiet dawn rows, and cold mountain mists.',
      story: `Three days beside the lake, surrounded by mountains, quiet mornings and long walks.

Pokhara does not demand hurry. It greets you at 5:30 AM with the chill of glacial runoff settling over Phewa Lake, while the dual peaks of Machapuchare catch the very first amber tint of sun before the world below is even awake.

We rented a cedar canoe with faded cerulean paint. Out in the center of the lake, with the water like black glass, the reflection of the Himalayas is so crisp that tilting your head upside down makes you feel suspended between two skies.

Later, climbing toward the World Peace Pagoda through rhododendron groves, the scent of wet pine and wild cardamom clings to your coat. You pass village elders sitting by stone chautaras, their hands resting on smooth wooden canes, nodding with a quiet generosity that requires no translation.

In the evenings, woodsmoke mixes with roasted cumin from lakeside tea stalls. You sit on a damp bench, tea glass warming both palms, watching the silhouette of the ridge dissolve into violet night.`,
      published: true,
      isFeatured: true,
      countryId: nepal.id,
      destId: pokharaDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
        caption: 'First light catching the sacred summit of Machapuchare above misty Phewa Lake',
        location: 'Phewa Tal, Pokhara',
        category: 'Landscape',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
        caption: 'Reflections on the tranquil waters at dawn',
        location: 'Lakeside South',
        category: 'Nature',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1000&q=85',
        caption: 'Warm masala chai served in a clay cup by the dockside',
        location: 'Baidam Ghat',
        category: 'Food',
        aspectRatio: '1/1',
        displayOrder: 3,
      },
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
        caption: 'Himalayan foothills descending toward the valley floor',
        location: 'Sarangkot Ridge',
        category: 'Landscape',
        aspectRatio: '3/2',
        displayOrder: 4,
      },
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
        caption: 'Prayer flags carrying blessings across the mountain pass',
        location: 'Anadu Hill Pass',
        category: 'Moments',
        aspectRatio: '2/3',
        displayOrder: 5,
      },
      {
        journeyId: pokharaJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85',
        caption: 'The twilight quiet over the southern bays of Pokhara',
        location: 'Happy Village',
        category: 'Landscape',
        aspectRatio: '16/9',
        displayOrder: 6,
      },
    ],
  });

  // --- 2. MUSTANG ---
  const mustangJourney = await prisma.journey.create({
    data: {
      title: 'Mustang',
      slug: 'mustang',
      countryName: 'Nepal',
      cityName: 'Lo Manthang',
      latitude: 29.1834,
      longitude: 83.9782,
      travelDate: new Date('2026-02-18'),
      daysCount: 7,
      coverImage: 'https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Seven days traversing high-altitude desert plateaus, wind-sculpted ochre cliffs, and the ancient walled kingdom of Lo Manthang.',
      story: `Crossing into Upper Mustang feels less like traveling geographically and more like entering an ancient geological memory.

The rain-shadow of Dhaulagiri strips the landscape down to its rawest, most majestic bone: towering vertical canyon walls banded in terracotta, sulphur yellow, and deep slate blue. The wind here carries the salt of prehistoric seas, trapped when the Indian tectonic plate smashed into Asia millions of years ago.

Reaching Lo Manthang after five days on horseback, the sudden view of its whitewashed perimeter walls framed against barren russet hills takes your breath away. Inside the gates, Buddhist monks in maroon robes stride through cobbled labyrinths with strings of yak-bone beads.

In Chhoser, we climbed into sky caves carved high into cliff faces three thousand years ago. Inside the cave chamber, sitting where hermit scholars once meditated, the silence is so deep you hear the rhythmic beat of your own blood.`,
      published: true,
      isFeatured: true,
      countryId: nepal.id,
      destId: mustangDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: mustangJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=1800&q=85',
        caption: 'The dramatic wind-sculpted cliffs of the Kali Gandaki gorge',
        location: 'Kagbeni to Chele',
        category: 'Landscape',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: mustangJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
        caption: 'Himalayan peaks towering behind the high desert plateau',
        location: 'Syangboche Pass',
        category: 'Landscape',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
      {
        journeyId: mustangJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=85',
        caption: 'Ancient stone chorten weathered by centuries of Tibetan plateau winds',
        location: 'Ghemi',
        category: 'Architecture',
        aspectRatio: '2/3',
        displayOrder: 3,
      },
      {
        journeyId: mustangJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
        caption: 'Pack horses resting beneath towering red clay formations',
        location: 'Dhakmar Cliffs',
        category: 'Moments',
        aspectRatio: '4/3',
        displayOrder: 4,
      },
    ],
  });

  // --- 3. KATHMANDU VALLEY ---
  const ktmJourney = await prisma.journey.create({
    data: {
      title: 'Kathmandu Valley',
      slug: 'kathmandu',
      countryName: 'Nepal',
      cityName: 'Kathmandu & Patan',
      latitude: 27.7172,
      longitude: 85.3240,
      travelDate: new Date('2026-01-20'),
      daysCount: 3,
      coverImage: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Three days lost in ancient courtyard labyrinths, gilded pagoda roofs, incense smoke, and the hypnotic spin of prayer wheels.',
      story: `Kathmandu does not reveal itself to those who rush. It lives in the hidden courtyards—the bahals—where time stands still beneath carved wooden peacock windows.

At dawn in Boudhanath, a quiet river of pilgrims circumambulates the massive white dome under the watchful gaze of the all-seeing Buddha eyes. The soft rhythm of leather soles against flagstones, butter lamps flickering in bronze bowls, and low Buddhist chants create an almost hypnotic gravity.

Cross the Bagmati to Patan and the craftsmanship of the Newar artisans surrounds you. Tiered brick temples stacked into the sky, copper repoussé doors burnished by millions of reverent touches, and narrow alleyways smelling of freshly roasted lentils and bitter chicory coffee.`,
      published: true,
      isFeatured: false,
      countryId: nepal.id,
      destId: ktmDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: ktmJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Boudhanath Stupa surrounded by prayer flags under the golden late sun',
        location: 'Boudha, Kathmandu',
        category: 'Architecture',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: ktmJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=85',
        caption: 'Carved wooden pagoda rafters of Patan Durbar Square',
        location: 'Mangal Bazaar, Patan',
        category: 'Architecture',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
      {
        journeyId: ktmJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85',
        caption: 'Marigold garlands piled high at the dawn vegetable market',
        location: 'Ason Chowk',
        category: 'Moments',
        aspectRatio: '1/1',
        displayOrder: 3,
      },
    ],
  });

  // --- 4. NAMCHE BAZAAR ---
  const namcheJourney = await prisma.journey.create({
    data: {
      title: 'Namche Bazaar',
      slug: 'namche-bazaar',
      countryName: 'Nepal',
      cityName: 'Khumbu Highlands',
      latitude: 27.8069,
      longitude: 86.7140,
      travelDate: new Date('2025-10-15'),
      daysCount: 6,
      coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Six days climbing into the natural amphitheater of the Sherpa capital, surrounded by Ama Dablam, Kongde Ri, and crisp alpine air.',
      story: `Climbing the steep switchbacks above the Hillary Suspension Bridge, the air thins and the pine scent sharpens into pure cold oxygen.

Then, suddenly, the ridge turns and Namche Bazaar opens before you like a horseshoe amphitheater of stone lodges stacked into the mountain face. Above, the sharp granite horn of Ama Dablam pierces the turquoise sky.

Evenings in Namche revolve around the cast-iron stoves burning dried juniper and peat in teahouses. Trekkers from around the world huddle in thick woolen blankets, drinking steaming seabuckthorn tea while reading faded mountaineering memoirs under the soft hum of solar lanterns.`,
      published: true,
      isFeatured: true,
      countryId: nepal.id,
      destId: namcheDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: namcheJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1800&q=85',
        caption: 'The terraced stone amphitheater of Namche Bazaar framed by mountain peaks',
        location: 'Namche Viewpoint, 3,440m',
        category: 'Landscape',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: namcheJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
        caption: 'The sharp pyramid ridge of Ama Dablam rising above the tree line',
        location: 'Kyangjuma Trail',
        category: 'Landscape',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
      {
        journeyId: namcheJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=85',
        caption: 'Buddhist mani stones inscribed with Tibetan mantras along the trail',
        location: 'Khumjung Pass',
        category: 'Moments',
        aspectRatio: '1/1',
        displayOrder: 3,
      },
    ],
  });

  // --- 5. BANDIPUR ---
  const bandipurJourney = await prisma.journey.create({
    data: {
      title: 'Bandipur',
      slug: 'bandipur',
      countryName: 'Nepal',
      cityName: 'Tanahun Hills',
      latitude: 27.9358,
      longitude: 84.4172,
      travelDate: new Date('2025-05-18'),
      daysCount: 3,
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Three quiet days on a car-free ridge, walking down 18th-century slate-paved Newari bazaars overlooking the Marsyangdi valley.',
      story: `Perched on a high saddle between Kathmandu and Pokhara, Bandipur feels preserved in amber.

Once a bustling waypoint on the India-Tibet trade route, the town retains its stately 18th-century Newari townhouses with carved wooden shutters, classical brickwork, and brass door knockers. No automobiles are permitted on the central bazaar, leaving the slate paving stones to children playing marbles and elderly men playing bagh-chal in the shade.

At sunset, walking out to the ridge of Thani Mai temple, the entire Annapurna and Manaslu ranges turn from molten copper to ice blue across the northern horizon.`,
      published: true,
      isFeatured: false,
      countryId: nepal.id,
      destId: bandipurDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: bandipurJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85',
        caption: 'Slate-paved main bazaar lined with preserved Newari merchant mansions',
        location: 'Bandipur Main Bazaar',
        category: 'Architecture',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: bandipurJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
        caption: 'Sunset mist settling into the deep Marsyangdi river valley below',
        location: 'Thani Mai Hilltop',
        category: 'Landscape',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
    ],
  });

  // --- 6. CHITWAN ---
  const chitwanJourney = await prisma.journey.create({
    data: {
      title: 'Chitwan',
      slug: 'chitwan',
      countryName: 'Nepal',
      cityName: 'Sauraha & Rapti',
      latitude: 27.5291,
      longitude: 84.4533,
      travelDate: new Date('2025-01-10'),
      daysCount: 3,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=88',
      excerpt: 'Three days along the foggy banks of the Rapti River, Tharu clay villages, and the dense emerald canopy of the sub-tropical lowlands.',
      story: `Nepal is not only high snow and granite; it is also the warm, mist-shrouded emerald plains of the Terai.

In Chitwan, the morning begins with the slow splash of long dugout canoes gliding across the Rapti River. The water is covered in silver steam. Through the haze, the silhouette of a greater one-horned rhinoceros grazing along the elephant grass seems like an apparition from an ancient epoch.

Walking through the adjacent Tharu villages at dusk, women in vibrant handwoven skirts sweep earthen courtyards painted with natural pigments of clay and rice flour. Smoke from cooking fires smells of mustard oil, dried tamarind, and river fish, settling gently across the quiet sugarcane fields.`,
      published: true,
      isFeatured: false,
      countryId: nepal.id,
      destId: chitwanDest.id,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        journeyId: chitwanJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
        caption: 'Morning mist lifting above the calm waters of the Rapti River',
        location: 'Rapti Riverbank, Sauraha',
        category: 'Landscape',
        aspectRatio: '16/9',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        journeyId: chitwanJourney.id,
        imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=85',
        caption: 'Sunlight filtering through the dense sal tree canopy',
        location: 'Chitwan National Park Forest',
        category: 'Nature',
        aspectRatio: '3/2',
        displayOrder: 2,
      },
    ],
  });

  console.log('Nepal-exclusive seeding complete! 6 iconic Nepal destinations populated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
