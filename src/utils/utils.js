// utils.js (or any appropriate utility file)

export const capitalizeWords = (str) => {
  if (!str) return ''; // Handle empty or null strings

  return str
    .split(' ') // Split the string into an array of words
    .map((word) => {
      if (word.length === 0) return ''; // Handle empty strings within the split
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase rest
    })
    .join(' '); // Join the words back into a single string
};
