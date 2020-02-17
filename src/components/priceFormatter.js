export const beautifyPriceValue = price => Math.round(price * 1e2) / 1e2;

export const beautifyBigPriceValue = price => {
    switch (true) {
        case price > 999 && price < 1000000:
            return (price / 1000).toFixed(1) + "k";
        case price > 999999 && price < 1000000000:
            return (price / 1000000).toFixed(1) + "m";
        case price > 999999999:
            return (price / 1000000000).toFixed(1) + "b";
        default:
            return price;
    }
};
