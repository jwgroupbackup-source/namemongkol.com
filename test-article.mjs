import { articles } from './src/data/articles.ts';

const slug = 'lucky-names-by-birthday-2569';
const found = articles.find(a => a.slug === slug);

console.log('Article found:', !!found);
console.log('Total articles:', articles.length);
if (found) {
  console.log('Title:', found.title);
  console.log('ID:', found.id);
} else {
  console.log('All slugs:');
  articles.forEach((a, i) => console.log(`${i}: ${a.slug}`));
}
