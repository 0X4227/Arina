import { utils } from 'near-api-js';

const useNumberFormatHook = () => {



    const formatNumber = (amount, decimals) => {
        if (typeof decimals !== "number" || decimals < 0) {
            return amount; // Return the original value if not a valid number
        }
        return Number(amount).toFixed(decimals); // Replace with your token symbol if necessary
    }

    const convertNumber = (amount, decimals) => {

        if (typeof amount !== "string" || amount < 0) {
            return amount; // Return the original value if not a valid number
        }

        if (typeof decimals !== "number" || decimals < 0) {
            return amount; // Return the original value if not a valid number
        }

        // Convert to a human-readable string with the specified number of decimal places
        const humanReadableValue = (amount / Math.pow(10, decimals)).toFixed(decimals);

        return humanReadableValue; // Replace with your token symbol if necessary
    };

    const parseNumber = (formattedValue, decimals) => {
        // Validate input
        // //console.log("formattedValue:", formattedValue); // Debug statement
        // //console.log("decimals:", decimals); // Debug statement
    
        if (typeof formattedValue !== "string") {
            console.warn("Formatted value must be a string");
            return null;
        }
        if (typeof decimals !== "number" || decimals < 0) {
            console.warn("Decimals must be a non-negative number");
            return null;
        }
    
        // Use a regular expression to extract the numeric part from the string
        const match = formattedValue.match(/^([\d.,]+)\s*(\w*)$/);
        //console.log("Regex match:", match); // Debug statement
    
        if (!match) {
            console.warn("Invalid formatted value");
            return null;
        }
    
        const amountString = match[1]; // The numeric part
        //console.log("amountString:", amountString); // Debug statement
    
        // Replace commas for proper parsing and convert to a number
        const amount = parseFloat(amountString.replace(/,/g, ''));
        //console.log("Parsed amount:", amount); // Debug statement
    
        if (isNaN(amount)) {
            console.warn("Invalid numeric value");
            return null;
        }
    
        // Convert to the smallest unit
        const smallestUnitValue = Math.round(amount * Math.pow(10, decimals));
        return smallestUnitValue.toString();
    };
    


    return { formatNumber, convertNumber, parseNumber };
};

export default useNumberFormatHook;
