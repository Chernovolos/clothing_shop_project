import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react'

type PropType = {
  images: string[];
  outOfStock?: boolean;
}

const ProductCartCarousel = ({images = []}: PropType) => {
  if (!images.length) return null;
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="embla relative">
      <PrevButton
        onClick={ onPrevButtonClick }
        disabled={ prevBtnDisabled }
        style={ {position: 'absolute', left: 0, top: 'calc(50% - 16px)'} }
      />
      <div className="embla__viewport" ref={ emblaRef }>
        <div className="embla__container">
          { images.map((img, i) => (
            <div className="embla__slide" key={ i }>
              <img
                src={ img }
                alt={ `thumb-${ i }` }
                className="w-full h-full object-cover"/>
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