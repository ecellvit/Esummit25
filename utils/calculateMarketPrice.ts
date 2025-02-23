const calculateMarketPrice = (basePrice: number, teams: number): number => {
  const mp = basePrice + (0.4-teams/40)*175
  return mp;
}

export default calculateMarketPrice;