import PlaceDetailContent from "./PlaceDetailContent";
import { places } from "../../../data/places";

export function generateStaticParams() {
  return places.map((place) => ({
    id: String(place.id),
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const place = places.find((p) => p.id === Number(resolvedParams.id));

  if (!place) {
    return {
      title: "Joy topilmadi | JoyBand",
    };
  }

  return {
    title: `${place.name} | JoyBand`,
    description: place.description,
  };
}

export default async function PlaceDetailPage({ params }) {
  const resolvedParams = await params;
  return <PlaceDetailContent id={resolvedParams.id} />;
}
