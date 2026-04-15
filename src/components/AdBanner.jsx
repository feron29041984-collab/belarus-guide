function AdBanner() {
  return (
    <a
      href="https://www.profitablecpmratenetwork.com/pu6j6zgf?key=4eb4d4eecfc2b1aa96fc7e220776e460"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="ad-banner"
      onClick={(e) => {
        // Можно добавить аналитику кликов здесь
        console.log('Ad clicked')
      }}
    >
      <span className="ad-label">Партнёр</span>
      <span className="ad-text">Полезные предложения для путешественников →</span>
    </a>
  )
}

export default AdBanner
