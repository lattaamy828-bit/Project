import { useState } from 'react';
import Hero from '../sections/Hero';
import FeaturedRail from '../sections/FeaturedRail';
import ArtToCosmetic from '../sections/ArtToCosmetic';
import GalleryHall from '../sections/GalleryHall';
import AtelierStory from '../sections/AtelierStory';
import JournalStrip from '../sections/JournalStrip';
import QuickView from '../components/QuickView';
import BrushDivider from '../components/Divider';
import type { Product } from '../data/products';

export default function Home() {
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <>
      <Hero />
      <BrushDivider seed={3} />
      <FeaturedRail onQuickView={setQuick} />
      <ArtToCosmetic />
      <BrushDivider seed={11} flip />
      <GalleryHall preview />
      <AtelierStory />
      <JournalStrip />
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
