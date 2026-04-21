import type { Product } from "../types/Product.ts";
import { useNavigate } from "react-router-dom";
import Basket from "../../public/images/icons/empty_basket.svg";
import { useParams } from "react-router";

const ProductCard = (({title, price, images, id}: Product) => {

  const navigate = useNavigate();
  const { category, cartId } = useParams();
  console.log("category", category, cartId);

  const handleClick = () => {
    navigate(`/${category}/${id}`);
  }
  return (
    <div onClick={handleClick} className="card-container group">
      <figure className="card-body">
        <div className="card-image">
          <img
            src={ images?.[0] }
            alt={ title }
          />
        </div>

        <figcaption className="relative">
          <button className="btn-card">
            <img className="card-img-basket" src={ Basket } alt="Basket Image" />
          </button>
          <p className="card-title">{ title }</p>
          <span className="card-price">{ price }</span>
        </figcaption>
      </figure>
    </div>
  )
});

export default ProductCard;