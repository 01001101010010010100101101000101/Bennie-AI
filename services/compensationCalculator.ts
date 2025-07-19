// Based on 2024 VA disability compensation rates.
// Source: https://www.va.gov/disability/compensation-rates/veteran-rates/

interface RateData {
  veteranOnly: number;
  veteranWithSpouse: number;
  veteranWithSpouseAndOneParent: number;
  veteranWithSpouseAndTwoParents: number;
  veteranWithOneParent: number;
  veteranWithTwoParents: number;
  addForFirstChild: number;
  addForAdditionalChild: number; 
  addForSpouseAidAndAttendance: number;
}

// Rates for 30% to 100%. 10% and 20% are flat rates regardless of dependents.
const rates: { [key: number]: RateData } = {
    30: { veteranOnly: 524.31, veteranWithSpouse: 582.31, veteranWithSpouseAndOneParent: 631.31, veteranWithSpouseAndTwoParents: 680.31, veteranWithOneParent: 573.31, veteranWithTwoParents: 622.31, addForFirstChild: 41.00, addForAdditionalChild: 35.00, addForSpouseAidAndAttendance: 64.00 },
    40: { veteranOnly: 755.28, veteranWithSpouse: 829.28, veteranWithSpouseAndOneParent: 890.28, veteranWithSpouseAndTwoParents: 951.28, veteranWithOneParent: 816.28, veteranWithTwoParents: 877.28, addForFirstChild: 55.00, addForAdditionalChild: 46.00, addForSpouseAidAndAttendance: 85.00 },
    50: { veteranOnly: 1075.16, veteranWithSpouse: 1165.16, veteranWithSpouseAndOneParent: 1242.16, veteranWithSpouseAndTwoParents: 1319.16, veteranWithOneParent: 1152.16, veteranWithTwoParents: 1229.16, addForFirstChild: 69.00, addForAdditionalChild: 58.00, addForSpouseAidAndAttendance: 107.00 },
    60: { veteranOnly: 1361.88, veteranWithSpouse: 1467.88, veteranWithSpouseAndOneParent: 1560.88, veteranWithSpouseAndTwoParents: 1653.88, veteranWithOneParent: 1454.88, veteranWithTwoParents: 1547.88, addForFirstChild: 83.00, addForAdditionalChild: 70.00, addForSpouseAidAndAttendance: 129.00 },
    70: { veteranOnly: 1716.28, veteranWithSpouse: 1838.28, veteranWithSpouseAndOneParent: 1947.28, veteranWithSpouseAndTwoParents: 2056.28, veteranWithOneParent: 1825.28, veteranWithTwoParents: 1934.28, addForFirstChild: 96.00, addForAdditionalChild: 82.00, addForSpouseAidAndAttendance: 150.00 },
    80: { veteranOnly: 1995.01, veteranWithSpouse: 2133.01, veteranWithSpouseAndOneParent: 2258.01, veteranWithSpouseAndTwoParents: 2383.01, veteranWithOneParent: 2114.01, veteranWithTwoParents: 2239.01, addForFirstChild: 110.00, addForAdditionalChild: 94.00, addForSpouseAidAndAttendance: 171.00 },
    90: { veteranOnly: 2241.91, veteranWithSpouse: 2395.91, veteranWithSpouseAndOneParent: 2536.91, veteranWithSpouseAndTwoParents: 2677.91, veteranWithOneParent: 2376.91, veteranWithTwoParents: 2517.91, addForFirstChild: 124.00, addForAdditionalChild: 106.00, addForSpouseAidAndAttendance: 193.00 },
    100: { veteranOnly: 3737.85, veteranWithSpouse: 3946.25, veteranWithSpouseAndOneParent: 4124.71, veteranWithSpouseAndTwoParents: 4303.17, veteranWithOneParent: 3916.31, veteranWithTwoParents: 4094.77, addForFirstChild: 138.48, addForAdditionalChild: 118.00, addForSpouseAidAndAttendance: 216.48 },
};

const flatRates: { [key: number]: number } = {
    10: 171.23,
    20: 338.49,
};

export interface CompensationArgs {
    rating: number;
    hasSpouse: boolean;
    childrenCount: number;
    parentsCount: number;
    spouseNeedsAid: boolean;
}

export const calculateDisabilityCompensation = (args: CompensationArgs): Record<string, unknown> => {
    const { rating, hasSpouse, childrenCount, parentsCount, spouseNeedsAid } = args;
    let totalAmount = 0;
    const breakdown: string[] = [];
    const notes: string[] = [];

    if (rating < 10 || rating > 100 || rating % 10 !== 0) {
        return {
            error: "I'm sorry, but I can only calculate ratings between 10% and 100% in increments of 10. Could you please provide a valid rating?",
            finalAmount: 0,
            breakdown: [],
            notes: []
        };
    }

    if (flatRates[rating]) {
        totalAmount = flatRates[rating];
        breakdown.push(`Base rate for ${rating}%: $${totalAmount.toFixed(2)}`);
        if (hasSpouse || childrenCount > 0 || parentsCount > 0) {
            notes.push(`For a ${rating}% rating, the rate is fixed and does not increase for dependents.`);
        }
    } else {
        const rateData = rates[rating];
        if (!rateData) {
            return {
                error: "I'm sorry, I encountered an error and couldn't find the rate data for the specified rating.",
                finalAmount: 0,
                breakdown: [],
                notes: []
            };
        }
        
        let baseAmount = 0;
        let baseDescription = "";

        if (hasSpouse) {
            if (parentsCount === 0) {
                baseAmount = rateData.veteranWithSpouse;
                baseDescription = `Base for ${rating}% with a spouse`;
            } else if (parentsCount === 1) {
                baseAmount = rateData.veteranWithSpouseAndOneParent;
                baseDescription = `Base for ${rating}% with a spouse and one parent`;
            } else { // parentsCount >= 2
                baseAmount = rateData.veteranWithSpouseAndTwoParents;
                baseDescription = `Base for ${rating}% with a spouse and two parents`;
            }
        } else { // no spouse
            if (parentsCount === 0) {
                baseAmount = rateData.veteranOnly;
                baseDescription = `Base for ${rating}% (veteran alone)`;
            } else if (parentsCount === 1) {
                baseAmount = rateData.veteranWithOneParent;
                baseDescription = `Base for ${rating}% with one parent`;
            } else { // parentsCount >= 2
                baseAmount = rateData.veteranWithTwoParents;
                baseDescription = `Base for ${rating}% with two parents`;
            }
        }
        
        totalAmount = baseAmount;
        breakdown.push(`${baseDescription}: $${baseAmount.toFixed(2)}`);
        
        if (childrenCount > 0) {
            const childAddition = rateData.addForFirstChild + (Math.max(0, childrenCount - 1) * rateData.addForAdditionalChild);
            totalAmount += childAddition;
            breakdown.push(`Add for ${childrenCount} child(ren): +$${childAddition.toFixed(2)}`);
        }

        if (hasSpouse && spouseNeedsAid) {
            const aidAmount = rateData.addForSpouseAidAndAttendance;
            totalAmount += aidAmount;
            breakdown.push(`Add for spouse needing Aid and Attendance: +$${aidAmount.toFixed(2)}`);
        }
    }
    
    notes.push("This is an estimate based on the 2024 VA compensation rates. Please verify all amounts with the VA.");

    return {
        finalAmount: parseFloat(totalAmount.toFixed(2)),
        breakdown,
        notes,
    };
};
