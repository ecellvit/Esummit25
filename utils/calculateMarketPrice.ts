const calculateMarketPrice = (basePrice: number, teams: number): number => {
  const mp = basePrice + (0.6-teams/40)*175
  return mp;
}

export default calculateMarketPrice;