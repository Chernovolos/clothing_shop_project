type Reason = 'page' | 'category' | 'product';

type NotFoundProps = {
  reason?: Reason;
}

const NOT_FOUND_MESSAGES: Record<Reason, { title: string, description: string }> = {
  page: {title: "Page not found", description: "Sorry, this page doesn't exist or has been moved."},
  category: {
    title: "Category not found",
    description: "Sorry, this category doesn't exist. Try choosing a different category.",
  },
  product: {title: "Product not found", description: "Sorry, this product doesn't exist."},
}

const NotFound = ({ reason = 'page' }: NotFoundProps) => {
  const { title, description } = NOT_FOUND_MESSAGES[reason];
  return (
    <div className="container">
      <div className="not-found-container">
        <h2 className="not-found-title">{ title }</h2>
      </div>
      <div>
        <p className="not-found-description">{ description }</p>
      </div>
    </div>
  )
}
export default NotFound