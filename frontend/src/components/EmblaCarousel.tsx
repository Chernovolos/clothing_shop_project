import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";

// const images = [1, 2, 3];
type Props = {
  images: string[];
  outOfStock: boolean;
};

const EmblaCarousel = ({images = [], outOfStock}: Props) => {
  if (!images.length) return null;
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    axis: "y",
    dragFree: true,
    containScroll: "keepSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log("outOfStock", outOfStock)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])
  // useEffect(() => {
  //   if (!emblaMainApi) return;
  //
  //   const onSelect = () => {
  //     const index = emblaMainApi.selectedScrollSnap();
  //     setSelectedIndex(index);
  //     emblaThumbsApi?.scrollTo(index);
  //   };
  //
  //   emblaMainApi.on("select", onSelect);
  //   onSelect();
  //
  //   return () => emblaMainApi.off("select", onSelect);
  // }, [emblaMainApi, emblaThumbsApi]);


  return (
    <div className="flex gap-4 max-w-3x">

      {/*THUMBS LEFT*/ }
      <div className="overflow-hidden h-130" ref={ emblaThumbsRef }>
        <div className="flex flex-col gap-4">
          { images.map((img, i) => (
            <div
              key={ i }
              onClick={ () => onThumbClick(i) }
              className={ `relative cursor-pointer h-20 w-20 border-2 flex items-center justify-center ${
                i === selectedIndex ? "border-gray-700" : "border-transparent"
              } ${ outOfStock ? "opacity-45" : "" }` }
            >
              <img src={ img } alt={ `thumb-${ i }` } className="object-cover w-full h-full"/>
              { outOfStock && (
                <div className="absolute flex items-center justify-center">
                  <span className="out-of-stock-thumb-left-title">
                    Out of stock
                  </span>
                </div>
              ) }
            </div>
          )) }
        </div>
      </div>

      {/*MAIN */ }
      <div className="overflow-hidden flex-1" ref={ emblaMainRef }>
        <div className="flex">
          { images.map((img, i) => (
            <div
              key={ i }
              className={ `relative min-w-full h-130 flex items-center justify-center text-4xl font-bold bg-gray-200
                ${ outOfStock ? "opacity-45" : "" } ` }
            >
              <img src={ img } alt={ `thumb-${ i }` } className="object-cover w-full h-full"/>
              { outOfStock && (
                <div className="absolute flex items-center justify-center">
                  <span className="out-of-stock-main-title">
                    Out of stock
                  </span>
                </div>
              ) }
            </div>
          )) }
        </div>
      </div>

    </div>
  )
}

export default EmblaCarousel;