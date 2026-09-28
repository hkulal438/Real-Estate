import { Navigation } from '@/components/sections/navigation';
import { Hero } from '@/components/sections/hero';
import { Story } from '@/components/sections/story';
import { Amenities } from '@/components/sections/amenities';
import { Residences } from '@/components/sections/residences';
import { Location } from '@/components/sections/location';
import { Gallery } from '@/components/sections/gallery';
import { Enquire } from '@/components/sections/enquire';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <Amenities />
        <Residences />
        <Location />
        <Gallery />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
