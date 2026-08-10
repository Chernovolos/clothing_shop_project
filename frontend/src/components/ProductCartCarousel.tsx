import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react'
import type { ImageDto } from "@/types/dtos/image.dto.ts";

type PropType = {
  images: ImageDto[];
  outOfStock?: boolean;
}

const ProductCartCarousel = ({images = []}: PropType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  if (!images.length) return null;

  return (
    <div className="embla relative flex-1 h-full">
      <PrevButton
        onClick={ onPrevButtonClick }
        disabled={ prevBtnDisabled }
        style={ {position: 'absolute', left: 0, top: 'calc(50% - 16px)'} }
      />
      <div className="embla__viewport" ref={ emblaRef }>
        <div className="embla__container">
          { images.map((img, i) => (
            <div
              key={ i }
              className="embla__slide">
              <img
                src={ img.url }
                alt={ `thumb-${ i }` }
                className="object-cover w-full h-full"/>
            </div>
          )) }
        </div>
      </div>
      <NextButton
        onClick={ onNextButtonClick }
        disabled={ nextBtnDisabled }
        style={ {position: 'absolute', right: 0, top: 'calc(50% - 16px)'} }
      />
    </div>
  )
}

export default ProductCartCarousel;