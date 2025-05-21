const categories = [
  'Cars',
  'Web3 Products',
  'Nigerian Artists',
  'Decentralized Terms',
  'Afrobeats Artists',
  'Nigerian Foods'
];

export function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
} 