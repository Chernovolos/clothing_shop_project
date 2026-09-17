type LoadingProps = {
  text?: string
}

const Loading = ({text = "Loading..."}: LoadingProps) => {
  return (
    <div className="container">
      <div className="loader-container">
        <div className="loader" data-text={ text }/>
      </div>
    </div>
  )
}
export default Loading