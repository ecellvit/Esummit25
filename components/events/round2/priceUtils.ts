// priceUtils.ts
export const calculatePrice = (
    prices: number[], // Accept an array of prices
    count: number | null
  ): number[] => {
    if (count === null) return prices; // Return original prices if count is null
  
    let increasePercentage = 0;
  
    // Determine the increase percentage based on the count
    switch (count) {
      case 12:
        increasePercentage = 20;
        break;
      case 11:
        increasePercentage = 18;
        break;
      case 10:
        increasePercentage = 16;
        break;
      case 9:
        increasePercentage = 14;
        break;
      default:
        increasePercentage = 0;
    }
  
    // Calculate adjusted prices for all items in the array
    const adjustedPrices = prices.map((price) =>
      Math.round(price * (1 + increasePercentage / 100))
    );
  
    console.log(`Original Prices: ${prices}, Adjusted Prices: ${adjustedPrices}`); // Log prices
    return adjustedPrices;
  };