import { db, initializeDatabase } from "./db.js";
import { fileURLToPath } from "node:url";

const names = [
  "Nebula Bistro",
  "Cosmic Cantina",
  "Starlight Grill",
  "Orbit Diner",
  "Quasar Kitchen",
  "Pulsar Plates",
  "Meteor Market",
  "Lunar Noodle Bar",
  "Solar Sushi",
  "Comet Curry House",
  "Asteroid Tacos",
  "Eclipse Eatery",
  "Galaxy Garden",
  "Rocket Ramen",
  "Supernova Smokehouse",
  "Zenith Pizza Lab",
  "Ion Burger Dock",
  "Aurora Dumplings",
  "Titan Taproom",
  "Andromeda Wraps",
  "Gravity Greens",
  "Red Dwarf BBQ",
  "Moonrise Bakery",
  "Photon Pho",
  "Stellar Sweets",
  "Crater Cafe",
  "Voyager Vegan",
  "Plasma Pancakes",
  "Milky Way Mezze",
  "Satellite Sandwiches",
  "Wormhole Wok",
  "Neptune Nachos",
  "Jupiter Jollof",
  "Venus Vindaloo",
  "Mars Mac Shack",
  "Saturn Souvlaki",
  "Mercury Momo",
  "Black Hole Bagels",
  "Oort Cloud Oyster Bar",
  "Celestial Chophouse",
  "Spaceport Shawarma",
  "Nova Nosh",
  "Helios Hotpot",
  "Kuiper Kebabs",
  "Starship Schnitzel",
  "Terra Tostadas",
  "Vortex Vegan Bowls",
  "Alien Arepas",
  "Skyline Samosas",
  "Polaris Poke",
];

const galaxies = [
  "Andromeda",
  "Milky Way",
  "Triangulum",
  "Sombrero",
  "Whirlpool",
  "Pinwheel",
  "Cartwheel",
  "Messier 87",
  "Centaurus A",
  "Large Magellanic Cloud",
];

const cuisines = [
  "Nebula Cuisine",
  "Fusion",
  "Street Food",
  "Gourmet",
  "Casual",
  "Budget",
  "Sushi",
  "Noodles",
  "BBQ",
  "Vegan",
  "Bakery",
  "Pizza",
  "Mediterranean",
  "Indian",
  "Latin",
];

const tags = [
  "Gourmet",
  "Casual",
  "Trending",
  "Budget",
  "New",
  "Fast",
  "Family",
  "Late Night",
  "Healthy",
  "Top Rated",
];

const images = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=420&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=420&fit=crop",
];

const streets = [
  "Orbit Ave",
  "Nebula Way",
  "Docking Bay Road",
  "Comet Street",
  "Pulsar Plaza",
  "Satellite Lane",
  "Rocket Row",
  "Meteor Market",
  "Solar Loop",
  "Starlight Blvd",
];

const dishes = [
  ["Galactic Burger", "Moon Fries", "Nebula Soda"],
  ["Cosmic Tacos", "Asteroid Queso", "Lime Comet Agua Fresca"],
  ["Rocket Ramen", "Ion Gyoza", "Solar Tea"],
  ["Star Pizza", "Meteor Mozzarella", "Orbit Cannoli"],
  ["Plasma Curry", "Lunar Naan", "Mango Lassi"],
  ["Photon Pho", "Spring Nebula Rolls", "Thai Iced Coffee"],
  ["Gravity Greens Bowl", "Protein Quasar Wrap", "Mint Moonade"],
  ["Supernova Brisket", "Crater Mac", "Sweet Tea"],
  ["Polaris Poke", "Seaweed Satellites", "Yuzu Sparkler"],
  ["Black Hole Bagel", "Nova Lox", "Cold Brew"],
];

function makeDetails(name, index) {
  const menu = dishes[index % dishes.length].map((itemName, itemIndex) => ({
    name: itemName,
    description: `${cuisines[(index + itemIndex) % cuisines.length]} favorite from ${name}.`,
    price: Number((6.5 + ((index + itemIndex * 3) % 12) * 1.15).toFixed(2)),
  }));

  return {
    description: `${name} serves ${cuisines[index % cuisines.length].toLowerCase()} from the ${galaxies[index % galaxies.length]} route, with quick prep and reliable orbital delivery.`,
    address: `${100 + index} ${streets[index % streets.length]}, Houston, TX 770${String(index % 10).padStart(2, "0")}`,
    menuItems: JSON.stringify(menu),
  };
}

export function seedRestaurants({ reset = false } = {}) {
  initializeDatabase();

  if (reset) {
    db.prepare("DELETE FROM restaurants").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'restaurants'").run();
  }

  const currentCount = db.prepare("SELECT COUNT(*) AS count FROM restaurants").get().count;

  const insert = db.prepare(`
    INSERT INTO restaurants
      (name, galaxy, cuisine, distance, delivery_time, tag, image, rating, delivery_fee, description, address, menu_items)
    VALUES
      (@name, @galaxy, @cuisine, @distance, @deliveryTime, @tag, @image, @rating, @deliveryFee, @description, @address, @menuItems)
  `);

  const updateDetails = db.prepare(`
    UPDATE restaurants
    SET description = @description,
        address = @address,
        menu_items = @menuItems
    WHERE id = @id
  `);

  const seedMany = db.transaction(() => {
    names.forEach((name, index) => {
      const distanceValue = (0.3 + ((index * 7) % 42) / 10).toFixed(1);
      const lowMinutes = 18 + ((index * 5) % 30);
      const highMinutes = lowMinutes + 10 + (index % 4) * 5;
      const details = makeDetails(name, index);

      const restaurant = {
        id: index + 1,
        name,
        galaxy: galaxies[index % galaxies.length],
        cuisine: cuisines[index % cuisines.length],
        distance: `${distanceValue} ly away`,
        deliveryTime: `${lowMinutes}-${highMinutes} min`,
        tag: tags[index % tags.length],
        image: images[index % images.length],
        rating: Number((4.1 + (index % 9) * 0.1).toFixed(1)),
        deliveryFee: Number((1.99 + (index % 5) * 0.75).toFixed(2)),
        ...details,
      };

      if (index >= currentCount) {
        insert.run(restaurant);
      } else {
        updateDetails.run(restaurant);
      }
    });
  });

  seedMany();
  return names.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const count = seedRestaurants({ reset: process.argv.includes("--reset") });
  console.log(`Seeded ${count} restaurants.`);
}
