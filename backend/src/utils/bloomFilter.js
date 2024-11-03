const { BloomFilter } = require('bloomfilter');

const bloom = new BloomFilter(1000, 0.01); // Adjust size and false positive rate as needed

const addToken = (token) => {
    bloom.add(token);
};

const checkToken = (token) => {
    return bloom.test(token);
};

module.exports = { addToken, checkToken };
